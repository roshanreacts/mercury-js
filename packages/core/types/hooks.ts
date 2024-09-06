export type THookType = string | 'CREATE_MODEL' | 'CREATE_RECORD';
import { CtxUser } from './index';

export interface Kareem {
  pre: (type: THookType, fn: Function) => void;
  before: (type: THookType, fn: Function) => void;
}

export interface THookParamsOptions {
  internal?: boolean;
  populate?: string[];
  select?: string[];
}

export interface THookParams {
  name: string;
  prevRecord?: unknown;
  deletedRecord?: unknown;
  records?: unknown[];
  filters?: Object;
  count?: number;
  query?: unknown;
  data?: unknown;
  user: CtxUser;
  record?: unknown;
  options: THookParamsOptions;
}
