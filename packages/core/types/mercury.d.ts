declare type TModel = {
  fields: TFields;
  name: string;
  options?: TOptions;
};

declare type TFields = {
  [fieldName: string]: TField;
};

declare type TField = {
  type:
    | 'string'
    | 'number'
    | 'float'
    | 'boolean'
    | 'relationship'
    | 'enum'
    | 'virtual'
    | 'mixed'
    | 'date';
  ref?: string;
  enum?: Array<string | number>;
  enumType?: string;
  required?: boolean;
  unique?: boolean;
  many?: boolean;
  localField?: string;
  foreignField?: string;
  bcrypt?: boolean;
  rounds?: number;
  ignoreGraphQL?: boolean;
  default?: any;
  [x: string]: any;
};

declare type TOptions = {
  update?: boolean;
  historyTracking: boolean;
  private?: boolean;
  indexes?: Array<TIndex>;
  [x: string]: any;
};

declare type TIndex = {
  fields: TIndexFields;
  options?: TIndexOptions;
};

declare type TIndexFields = {
  [fieldName: string]: number;
};

declare type TIndexOptions = {
  unique?: boolean;
  sparse?: boolean;
  partialFilterExpression?: any;
  collation?: any;
  expireAfterSeconds?: number;
  [key: string]: any;
};
