<script lang="ts">
	import Loader from './Loader.svelte';
	import { navigating } from '$app/stores';

	let show = $state(false);

	const navigatingDebounceMs = 100;

	$effect(() => {
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
	});
</script>

<Loader {show} overlay fullScreen />
