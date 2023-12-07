import { ZodTypeAny, record, z } from 'zod';

const configSchema = z.object({
  client: z
    .function()
    .args(z.string())
    .returns(z.promise(z.object({}))),
  url: z.string().url(),
});

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

const accountSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  user: userSchema,
});

const schemaCrud = <T extends ZodTypeAny>(name: string, schemaType: T) =>
  z.object({
    find: z.function().returns(z.array(schemaType)),
    findOne: z.function().returns(schemaType),
    create: z.function().args(schemaType).returns(z.string()),
    update: z.function().returns(schemaType),
    delete: z.function().returns(schemaType),
  });

const modelSchema = z.object({
  Users: schemaCrud('User', userSchema),
  Accounts: schemaCrud('Account', accountSchema),
});
export type TConfig = z.infer<typeof configSchema>;

class MercuryClient {
  private _client: Function;
  private _url: string;
  constructor(config: TConfig) {
    const test = configSchema.parse(config);
    console.log(test);
    this._client = config.client;
    this._url = config.url;
  }
  get client() {
    return this._client;
  }
  start() {
    // Dynamically add public keys to the MercuryClient model
    Object.keys(modelSchema.shape).forEach((model) => {
      console.log(`Adding ${model} to MercuryClient`);
      Object.defineProperty(this, model, {
        get() {
          console.log(`Calling action for ${model}`);
          return new Model(this, model);
        },
      });
    });
  }
}

class Model {
  private _modeName: string;
  private request: MercuryClient;
  private url: string;
  constructor(client: MercuryClient, modeName: string) {
    this._modeName = modeName.slice(0, -1); // remove the s
    this.request = client.client;
    this.url = client.url;
  }
  create<T>(record: T) {
    this.request(this.);
    return `Created for ${this._modeName}`;
  }
}

interface MercuryClient extends z.infer<typeof modelSchema> {}

export default MercuryClient;
