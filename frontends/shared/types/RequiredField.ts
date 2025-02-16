export type RequiredField<T, P extends keyof T> = T & { [K in P]-?: T[K] };
