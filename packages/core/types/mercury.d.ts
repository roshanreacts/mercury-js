declare type TModel = {
  fields: TFields;
  name: string;
};

declare type TFields = {
  [fieldName: string]: TField;
};

declare type TField = {
  type: string;
  ref?: string;
  enum?: string[];
  enumType?: string;
  isRequired?: boolean;
};

declare type TOptions = {
  historyTracking: boolean;
};
