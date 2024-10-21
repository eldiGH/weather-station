export type InferMap<M extends Map<unknown, unknown>> =
	M extends Map<infer K, infer V> ? [K, V] : never;

export type InferMapKey<M extends Map<unknown, unknown>> = InferMap<M>[0];

export type InferMapValue<M extends Map<unknown, unknown>> = InferMap<M>[1];
