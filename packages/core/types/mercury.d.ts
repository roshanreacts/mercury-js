declare class Mercury {
  schemaList: Array<schemaType>;
  roles: Array<string>;
  adminRole: string;
  adapter: DbAdapter;
  path: string;
  db: { [x: string]: any };
  createList: (name: string, schema: listSchema) => void;
  set views(viewsList: Array<ViewType>);
  set view(viewObj: ViewType);
  connect: (path: string) => void;
  disconnect: () => void;
}

declare class MercuryTBare extends Mercury {
  private _lists: Array<schemaType>;
  private _views: Array<ViewType>;
  private _hooks: any;
  private _schema: string[];
  private _resolvers: unknown;
  private _dbModels: { [key: string]: unknown };
  private _roles: Array<string>;
  private _adminRole: string;
  createPreHook: (
    name: SupportedHooks,
    method: (this: any, next: () => void, done: () => void) => void
  ) => void;
  createPostHook: (
    name: SupportedHooks,
    method: (this: any, next: () => void, done: () => void) => void
  ) => void;
}

type DbAdapter = 'mongoose';

declare interface String {
  toProperCase: () => string;
}
declare const mercury: Mercury;
declare interface ComponentType {
  component: string;
  props?: { [x: string]: any } | null;
  children:
    | Array<ComponentType>
    | ComponentType
    | null
    | string
    | number
    | boolean;
}
declare interface ViewType {
  path: string;
  component: Array<ComponentType> | ComponentType;
  data?: {
    [x: string]: any;
  };
  methods?: {
    [x: string]: () => void | any;
  };
  templates?: {
    [x: string]: any;
  };
  compoLib?: {
    [x: string]: any;
  };
}

type SupportedHooks = 'CREATELIST';
