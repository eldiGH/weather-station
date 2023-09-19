<script lang="ts">
	import { createRequestPoller } from '$lib/helpers/requestPoller';
	import { onDestroy, onMount } from 'svelte';

	const requestPoller = createRequestPoller();

	onMount(() => {
		requestPoller.onMount();
	});

	onDestroy(() => {
		requestPoller.onDestroy();
	});
</script>
