<script lang="ts">
	import type { Timeout } from '@shared/types/Timeout';
	import Spinner from './Spinner.svelte';

	interface Props {
		overlay?: boolean;
		show?: boolean;
		spinnerSize?: number;
		sticky?: boolean;
		delayMs?: number;
	}

	const {
		overlay = false,
		show = false,
		spinnerSize = 128,
		sticky = false,
		delayMs
	}: Props = $props();

	let delayTimeout: Timeout | null = null;
	$effect(() => {
		if (delayMs === undefined) {
			return;
		}

		if (show === false) {
			if (delayTimeout) {
				clearTimeout(delayTimeout);
			}

			delayPassed = false;
			return;
		}

		delayTimeout = setTimeout(() => {
			delayTimeout = null;
			delayPassed = true;
		}, delayMs);
	});

	let delayPassed = $state(false);
	let shouldShowLoader = $derived(delayMs !== undefined ? show && delayPassed : show);
</script>

{#if shouldShowLoader}
	<div class:overlay class="loader-container" class:sticky>
		<div class="spinner" class:sticky>
			<Spinner size={spinnerSize} />
		</div>
	</div>
{/if}

<style lang="scss">
	.loader-container {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;

		&.sticky {
			align-items: baseline;
		}
	}

	.overlay {
		z-index: 99999;
		background-color: var(--loader-overlay-color);
	}

	.spinner {
		z-index: 99999;

		&.sticky {
			position: sticky;
			top: 50%;
			transform: translateY(-50%);
		}
	}
</style>
