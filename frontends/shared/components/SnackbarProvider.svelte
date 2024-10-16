<script lang="ts" module>
	import { writable } from 'svelte/store';
	import { v4 as uuid } from 'uuid';

	export type SnackbarSeverity = 'success' | 'error';
	export interface Snackbar {
		severity: SnackbarSeverity;
		message: string;
		uuid: string;
	}

	const snackbarStore = writable<Snackbar[]>([]);

	const removeSnackbar = (snackbar: Snackbar) =>
		snackbarStore.update((snackbars) => snackbars.filter((s) => s !== snackbar));

	export const snackbar = {
		pushSuccess: (message: string) =>
			snackbarStore.update((s) => [...s, { severity: 'success', message, uuid: uuid() }]),
		pushError: (
			message: string = 'Coś poszło nie tak. Odśwież stronę i spróbuj ponownie później.'
		) => snackbarStore.update((s) => [...s, { severity: 'error', message, uuid: uuid() }])
	};
</script>

<script lang="ts">
	import Snackbar from './Snackbar.svelte';

	let visibleSnackbars = $derived($snackbarStore.slice(0, 3));
</script>

<div class="snackbar-container">
	{#each visibleSnackbars as s (s.uuid)}
		<Snackbar snackbar={s} deleteSnackbarFunc={() => removeSnackbar(s)} />
	{/each}
</div>

<style lang="scss">
	.snackbar-container {
		position: fixed;
		bottom: 5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		pointer-events: none;
	}
</style>
