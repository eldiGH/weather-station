<script lang="ts">
	import Loader from './Loader.svelte';
	import { navigating } from '$app/stores';

	let show = false;

	const navigatingDebounceMs = 100;

	$: {
		const nav = $navigating;

		if (nav) {
			let timeout = setTimeout(() => {
				show = true;
			}, navigatingDebounceMs);

			nav.complete.then(() => {
				show = false;
				clearTimeout(timeout);
			});
		}
	}
</script>

{#if show}
	<div class="container">
		<Loader show={true} overlay />
	</div>
{/if}

<style lang="scss">
	.container {
		position: fixed;
		inset: 0;
		z-index: 9999999;
	}
</style>
