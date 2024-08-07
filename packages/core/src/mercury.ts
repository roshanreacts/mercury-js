import _ from 'lodash';
import mongoose from 'mongoose';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Kareem from 'kareem';
import Create from './Create';
import ScalarResolver from './Scalars';

String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};
class Mercury {
  private _lists: Array<schemaType> = [];
  private _views: Array<ViewType> = [];
  private _hooks = new Kareem();
  private _schema: string[] = [
    `
  scalar DateTime
  scalar EncryptString
  scalar IntString
  scalar EmailAddress
  scalar NegativeFloat
  scalar NegativeInt
  scalar NonNegativeFloat
  scalar NonNegativeInt
  scalar NonPositiveFloat
  scalar NonPositiveInt
  scalar PhoneNumber
  scalar PositiveFloat
  scalar PositiveInt
  scalar PostalCode
  scalar UnsignedFloat
  scalar UnsignedInt
  scalar URL
  scalar BigInt
  scalar Long
  scalar GUID
  scalar HexColorCode
  scalar HSL
  scalar HSLA
  scalar IPv4
  scalar IPv6
  scalar ISBN
  scalar MAC
  scalar Port
  scalar RGB
  scalar RGBA
  scalar USCurrency
  scalar JSON
  scalar JSONObject

  enum sort {
    asc
    desc
  }

  input whereID {
    is: ID
    isNot: ID
    in: [ID!]
    notIn: [ID!]
  }
  
  input whereString {
    is: String
    isNot: String
    contains: String
    notContains: String
    startsWith: String
    notStartWith: String
    endsWith: String
    notEndsWith: String
    isIn: [String]
    notIn: [String]
  }
  
  input whereInt {
    is: Int
    isNot: Int
    lt: Int
    lte: Int
    gt: Int
    gte: Int
    in: [Int]
    notIn: [Int]
  }
  
  input whereDateTime {
    is: String
    isNot: String
    lt: String
    lte: String
    gt: String
    gte: String
    in: [String]
    notIn: [String]
  }

  type Query {
    getView(path: String): JSON
  }
  `,
  ];
  private _resolvers: any = ScalarResolver;
  private _dbModels: { [key: string]: any } = {};
  private _dbSchema: { [key: string]: any } = {};
  private _roles: Array<string> = [];
  private _adminRole = '';

  adapter: DbAdapter;
  path: string;
  postUpdateCallback: null | Function;

  constructor() {
    this.adapter = 'mongoose';
    this.path = 'mongodb://localhost:27017/mercuryapp';
    this._roles = ['SUPERADMIN', 'USER', 'ANONYMOUS'];
    this._adminRole = 'SUPERADMIN';

    this._resolvers = mergeResolvers([
      this._resolvers,
      [
        {
          Query: {
            getView: (root: any, { path }: { path: string }) => {
              return this.getView(path);
            },
          },
        },
      ],
    ]);
    this.postUpdateCallback = null;
  }

  get schema(): any {
    return mergeTypeDefs(this._schema);
  }

  get resolvers() {
    return this._resolvers;
  }

  get db() {
    return this._dbModels;
  }

  get dbschema() {
    return this._dbSchema;
  }

  getView(path: string) {
    return this._views.find((view) => view.path === path);
  }

  public set views(viewsList: Array<ViewType>) {
    _.concat(this._views, viewsList);
  }
  public set view(viewObj: ViewType) {
    this._views.push(viewObj);
  }

  public get roles() {
    return this._roles;
  }

  public get adminRole() {
    return this._adminRole;
  }

  public get schemaList() {
    return this._lists;
  }
  createPreHook(
    name: SupportedHooks,
    method: (this: any, next: () => void, done: () => void) => void
  ) {
    this._hooks.pre(name, method);
  }
  createPostHook(
    name: SupportedHooks,
    method: (this: any, next: () => void, done: () => void) => void
  ) {
    this._hooks.post(name, method);
  }
  public package(packages: Array<(mercury: MercuryTBare) => void>) {
    packages.map((pkg) => pkg(this as any));
  }
  connect(path: string) {
    this.path = path;
    mongoose.connect(this.path);
    mongoose.set('strictQuery', true);
  }
  async disconnect() {
    await mongoose.disconnect();
    await mongoose.connection.close();
  }
  private _createHistory(name: string, schema: listSchema) {
    const historySchema: listSchema = {
      fields: {
        recordId: {
          type: 'relationship',
          ref: name,
        },
        operationType: {
          type: 'enum',
          enum: ['UPDATE', 'DELETE'],
          enumType: 'string',
          isRequired: true,
        },
        instanceId: {
          type: 'string',
          isRequired: true,
        },
        dataType: {
          type: 'string',
          isRequired: true,
        },
        fieldName: {
          type: 'string',
          isRequired: true,
        },
        newValue: {
          type: 'string',
          isRequired: true,
        },
        oldValue: {
          type: 'string',
          isRequired: true,
        },
      },
      hooks: schema.historyHooks,
      access: schema.access,
      isHistory: true,
    };
    this._createList(`${name}History`, historySchema);
  }
  private _createList(name: string, schema: listSchema) {
    const regexPascal = /^[A-Z][A-Za-z]*$/; //Pascalcase regex
    if (!regexPascal.test(name) || name.slice(-1) === 's') {
      throw new Error(
        "Invalid name, should be PascalCase and should not have 's' at the end"
      );
    }
    schema.isHistory = false;
    if (!_.has(schema, 'access')) {
      schema.access = {
        default: true,
        acl: this._roles.map((role: string) => ({
          [role]: true,
        })),
      };
    }
    if (!_.has(schema, 'public')) {
      schema.public = false;
    }
    // execute prehooks BEFORE_CREATELIST
    this._hooks.execPre(
      'CREATELIST',
      { name: name, schema: schema },
      (error: { message: string }) => {
        if (error) {
          throw new Error(
            `Pre createlist hook execution has failed: ${error.message}`
          );
        }
      }
    );
    this._lists.push({ _model: name, ...schema });

    const create = new Create(this);
    const createModel = create.createList({ _model: name, ...schema });
    this._schema.push(createModel.schema);
    this._resolvers = mergeResolvers([this._resolvers, createModel.resolver]);
    this._dbModels[name] = createModel.models.newModel;
    this._dbSchema[name] = createModel.models.newSchema;
    // execute posthooks AFTER_CREATELIST
    this.postUpdateHook();
    // this._hooks.execPost(
    //   'CREATELIST',
    //   { name: name, schema: schema },
    //   (error: { message: string }) => {
    //     if (error) {
    //       throw new Error(
    //         `Post createlist hook execution has failed: ${error.message}`
    //       );
    //     }
    //   }
    // );
  }
  async postUpdateHook() {
    if (this.postUpdateCallback) await this.postUpdateCallback();
  }
  createList(name: string, schema: listSchema) {
    if (schema.enableHistoryTracking) {
      this._createHistory(name, schema);
    }
    this._createList(name, schema);
  }
}
const mercury = new Mercury();
export default mercury;
