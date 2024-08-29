import { TFields } from './index';

export type ModelWithFields<T> = T & { fields: TFields };
export type Keys<T, K extends keyof T> = T[K];
