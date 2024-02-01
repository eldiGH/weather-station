import { writable } from 'svelte/store';

const createSidebarStore = () => {
	const { subscribe, set, update } = writable(false);

	const open = () => set(true);
	const close = () => set(false);
	const toggle = () => update((old) => !old);

	return { open, close, toggle, subscribe };
};

export const sidebarStore = createSidebarStore();
