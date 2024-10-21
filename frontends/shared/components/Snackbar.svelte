<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snackbar } from '../helpers/snackbar';
	import { slide } from 'svelte/transition';

	interface Props {
		snackbar: Snackbar;
		deleteSnackbarFunc: () => void;
	}

	const snackbarVisibilityTime = 3000;

	const { snackbar, deleteSnackbarFunc }: Props = $props();

	onMount(() => {
		setTimeout(() => {
			deleteSnackbarFunc();
		}, snackbarVisibilityTime);
	});
</script>

<div transition:slide={{ axis: 'y', duration: 500 }} class={`snackbar ${snackbar.severity}`}>
	{snackbar.message}
</div>

<style lang="scss">
	@use '../styles/vars' as v;

	.snackbar {
		color: white;
		padding: 1rem;
		min-width: 200px;
		max-width: 400px;
		z-index: v.$loaderZIndex + 1;
		border-radius: 10px;
		text-align: center;
		margin-top: 1.5rem;
		pointer-events: all;

		&.success {
			background-color: #10d710;
		}

		&.error {
			background-color: #d80000;
		}
	}
</style>
