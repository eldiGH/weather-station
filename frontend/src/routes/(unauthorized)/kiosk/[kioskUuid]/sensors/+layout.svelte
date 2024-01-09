<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import { trpcWs } from '$lib/api/trpc';

	export let data: LayoutData;

	let unsubscribe: undefined | (() => void) = undefined;

	onMount(() => {
		unsubscribe = trpcWs().kiosk.subscribeKiosk.subscribe(
			{ kioskUuid: data.kioskUuid },
			{ onData: () => {} }
		).unsubscribe;
	});

	onDestroy(() => {
		unsubscribe?.();
	});
</script>

<slot />
