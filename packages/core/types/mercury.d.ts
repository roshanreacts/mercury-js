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
    | 'password'
    | 'number'
    | 'float'
    | 'boolean'
    | 'relationship'
    | 'enum';
  ref?: string;
  enum?: Array<string | number>;
  enumType?: string;
  isRequired?: boolean;
  many?: boolean;
};

declare type TOptions = {
  historyTracking: boolean;
  private?: boolean;
};
