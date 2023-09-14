import { getContext, setContext } from 'svelte';
import type { Writable } from 'svelte/store';

export interface Contexts {
	kioskMainNavigationTabs: Writable<boolean>;
}

export const getAppContext = <T extends keyof Contexts>(key: T): Contexts[T] => getContext(key);
export const setAppContext = <T extends keyof Contexts>(key: T, value: Contexts[T]) =>
	setContext(key, value);
