<script lang="ts">
	import { navigating } from '$app/stores';
	import Loader from './Loader.svelte';

	let interval: NodeJS.Timer | null = null;
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

<Loader {show} overlay />
