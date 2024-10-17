import { writable } from 'svelte/store';
import { v4 as uuid } from 'uuid';

export type SnackbarSeverity = 'success' | 'error';
export interface Snackbar {
	severity: SnackbarSeverity;
	message: string;
	uuid: string;
}

export const snackbarStore = writable<Snackbar[]>([]);

export const removeSnackbar = (snackbar: Snackbar) =>
	snackbarStore.update((snackbars) => snackbars.filter((s) => s !== snackbar));

export const snackbar = {
	pushSuccess: (message: string) =>
		snackbarStore.update((s) => [...s, { severity: 'success', message, uuid: uuid() }]),
	pushError: (message: string = 'Coś poszło nie tak. Odśwież stronę i spróbuj ponownie później.') =>
		snackbarStore.update((s) => [...s, { severity: 'error', message, uuid: uuid() }])
};
