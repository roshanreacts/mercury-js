declare interface THookType {
  CREATE_MODEL: 'CREATE_MODEL';
}

declare interface Kareem {
  pre: (type: keyof THookType, fn: Function) => void;
  before: (type: keyof THookType, fn: Function) => void;
}
