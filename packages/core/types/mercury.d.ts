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
    | 'mixed';
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
};

declare type TOptions = {
  historyTracking: boolean;
  private?: boolean;
};
