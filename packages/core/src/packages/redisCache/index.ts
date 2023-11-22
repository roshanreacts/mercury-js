import { RedisClientType, createClient, SchemaFieldTypes } from 'redis';
import uniqid from 'uniqid';

function AfterHook(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (this: Redis, ...args: any[]) {
    await this.client.connect();

    const result = originalMethod.apply(this, args);
    if (result instanceof Promise) {
      return result.then(async (res: any) => {
        await this.client.disconnect();
        return res;
      });
    } else {
      await this.client.disconnect();
      return result;
    }
  };

  return descriptor;
}

const redisFieldType = {
  string: SchemaFieldTypes.TEXT,
  number: SchemaFieldTypes.NUMERIC,
  boolean: SchemaFieldTypes.TAG,
  tag: SchemaFieldTypes.TAG,
  geo: SchemaFieldTypes.GEO,
  vector: SchemaFieldTypes.VECTOR,
};

type RedisFieldType = typeof redisFieldType;
export default class Redis {
  client: RedisClientType;
  models: any = [];
  prefix: string = 'redis';
  constructor(prefix?: string) {
    this.client = createClient();
    this.initializeClient();
    if (prefix) {
      this.prefix = prefix;
    }
  }

  async initializeClient() {
    this.client.on('error', (err) => {
      throw new Error(err);
    });
  }

  setClient(client: RedisClientType) {
    this.client = client;
  }

  @AfterHook
  async set(key: string, value: string) {
    await this.client.set(key, value);
  }

  @AfterHook
  async get(key: string) {
    return await this.client.get(key);
  }

  @AfterHook
  async createSchema(
    name: string,
    fields: {
      [x: string]: {
        type: keyof RedisFieldType;
        sortable?: boolean;
        noindex?: boolean;
      };
    },
    options: any
  ) {
    try {
      this.models.push({ name, fields, options });
      const fieldMap: { [x: string]: any } = {};
      Object.keys(fields).forEach((key) => {
        const type = redisFieldType[fields[key].type];
        fieldMap[`$.${key}`] = {
          type,
          AS: key,
          SORTABLE: fields[key].sortable || true,
          NOINDEX: fields[key].noindex || false,
        };
      });
      await this.client.ft.create(`${this.prefix}_${name}`, fieldMap, {
        ON: 'JSON',
        PREFIX: `${this.prefix}_${name}:`,
      });
    } catch (e: any) {
      if (e.message === 'Index already exists') {
        return;
      } else {
        // Something went wrong, perhaps RediSearch isn't installed...
        console.error(e);
        process.exit(1);
      }
    }
  }

  @AfterHook
  async insert(name: string, data: any) {
    const id = uniqid();
    return await this.client.json.set(
      `${this.prefix}_${name}:${id}`,
      '$',
      data
    );
    return { id, ...data };
  }

  @AfterHook
  async search(name: string, field: string, value: string) {
    return await this.client.ft.search(
      `${this.prefix}_${name}`,
      `@name:${value}`
    );
  }
}

// let cache: Redis;

// (async () => {
//   const client = await createClient().on('error', (err) => {
//     throw new Error(err);
//   });

//   cache = new Redis(client as RedisClientType);
// })();

// export default cache;
