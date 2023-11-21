declare type CtxUser = {
  id: string;
  profile: string;
};

declare type TAction = 'create' | 'read' | 'update' | 'delete';

declare type Rule = {
  modelName: string;
  access: {
    [TAction: string]: boolean;
  };
  fieldLevelAccess?: boolean;
  fields?: {
    [fieldName: string]: {
      [TAction: string]: boolean;
    };
  };
  sharingRules?: 'PRIVATE' | 'PUBLIC_READ' | 'PUBLIC_READ_WRITE';
};

declare type Profile = {
  name: string;
  rules: Rule[];
};

declare type PopulateSchema = Array<{
  path: string;
  select: string[];
  populate?: PopulateSchema;
}>;
