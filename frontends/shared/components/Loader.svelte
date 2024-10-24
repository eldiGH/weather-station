<script lang="ts">
	import { fade } from 'svelte/transition';
	import Spinner from './Spinner.svelte';

	interface Props {
		overlay?: boolean;
		show?: boolean;
		spinnerSize?: number;
		sticky?: boolean;
		fullScreen?: boolean;
	}

	const {
		overlay = false,
		show = false,
		spinnerSize = 128,
		sticky = false,
		fullScreen
	}: Props = $props();
</script>

{#if show}
	<div
		in:fade={{ duration: 400 }}
		out:fade={{ duration: 200 }}
		class:full-screen={fullScreen}
		class:overlay
		class="loader-container"
		class:sticky>
		<div class="spinner" class:sticky>
			<Spinner size={spinnerSize} />
		</div>
	</div>
{/if}

<style lang="scss">
	@use '@shared/ui/styles/vars' as v;

	.loader-container {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;

		&.full-screen {
			position: fixed;
			z-index: v.$loaderZIndex + 1;
		}

		&.sticky {
			align-items: baseline;
		}
	}

	.overlay {
		z-index: v.$loaderZIndex;
		background-color: var(--loader-overlay-color);
	}

	.spinner {
		z-index: v.$loaderZIndex;

		&.sticky {
			position: sticky;
			top: 50%;
			transform: translateY(-50%);
		}
	}
</style>
