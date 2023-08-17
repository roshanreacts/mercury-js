type ModelWithFields<T> = T & { fields: TFields };
type Keys<T, K extends keyof T> = T[K];
