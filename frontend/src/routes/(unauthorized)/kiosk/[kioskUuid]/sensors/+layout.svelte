<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import { resolveRoute } from '$app/paths';
	import { trpcWs } from '$lib/api/trpc';

	export let data: LayoutData;

	let unsubscribe: undefined | (() => void) = undefined;

	// const { setNextPollDate, unsubscribeAction } = subscribeAction('api:kioskData');

	// $: {
	// 	setNextPollDate(data.kioskData.nextRefreshTimestamp);
	// }

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
