import type { Readable } from 'svelte/store';

export type InferStoreType<Store extends Readable<unknown>> =
	Store extends Readable<infer T> ? T : never;
