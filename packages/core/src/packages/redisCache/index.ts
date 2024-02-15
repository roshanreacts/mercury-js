import { RedisClientType, RedisClientOptions, createClient, SchemaFieldTypes } from 'redis';
import type { Mercury } from '../../mercury';

type RedisCacheConfig = {
  prefix?: string;
  client?: {
    url?: string
    socket: {
      tls?: boolean
    }
  };
};

declare module '../../mercury' {
  interface Mercury {
    cache: Redis;
  }
}

export default (config?: RedisCacheConfig) => {
  return (mercury: Mercury) => {
    // extend mercury to include a cache property

    mercury.cache = new Redis(config);
    (async () => {
      await mercury.cache.client.connect();
    })();
  };
};

function AfterHook(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (this: Redis, ...args: any[]) {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const result = originalMethod.apply(this, args);
      if (result instanceof Promise) {
        return result.then(async (res: any) => {
          // await this.client.disconnect();
          return res;
        });
      } else {
        // await this.client.disconnect();
        return result;
      }
    } catch (error: any) {
      console.log("Redis Client Error: ", error)
    } finally {
      // Always disconnect the client when done
      if (this.client.isOpen) {
        await this.client.disconnect();
      }
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
export class Redis {
  client: RedisClientType;
  models: any = [];
  prefix: string = 'redis';
  constructor(config?: RedisCacheConfig) {
    if (config?.prefix) {
      this.prefix = config.prefix;
    }
    const redisConfig = config?.client ? config.client : undefined;
    this.client = createClient(redisConfig);
    this.initializeClient();
  }

  async initializeClient() {
    this.client.on('error', (err) => {
      throw new Error(err);
    });
  }

  setClient(client: RedisClientType) {
    this.client = client;
  }

  // @AfterHook
  async set(key: string, value: string) {
    await this.client.set(key, value);
  }

  async delete(key: string) {
    await this.client.del(key);
  }

  // @AfterHook
  async get(key: string) {
    return await this.client.get(key);
  }

  // @AfterHook
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
      await this.client.ft.create(`${this.prefix}:${name}`, fieldMap, {
        ON: 'JSON',
        PREFIX: `${this.prefix}:${name}:`,
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

  // @AfterHook
  async insert(name: string, data: any) {
    await this.client.json.set(`${this.prefix}:${name}:${data.id}`, '$', data);
    return data;
  }

  // @AfterHook
  async search(name: string, query: string) {
    return await this.client.ft.search(`${this.prefix}:${name}`, query);
  }
}
