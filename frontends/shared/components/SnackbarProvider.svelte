<script lang="ts">
	import { removeSnackbar, snackbarStore } from '../helpers/snackbar';

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
