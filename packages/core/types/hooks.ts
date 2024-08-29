export type THookType = string | 'CREATE_MODEL' | 'CREATE_RECORD';

export interface Kareem {
  pre: (type: THookType, fn: Function) => void;
  before: (type: THookType, fn: Function) => void;
}
