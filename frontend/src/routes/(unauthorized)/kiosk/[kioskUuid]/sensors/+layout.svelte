<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LayoutData } from './$types';
	import { subscribeAction } from '$lib/components/ActionPoller.svelte';

	export let data: LayoutData;

	const { setNextPollDate, unsubscribeAction } = subscribeAction('api:kioskData');

	onDestroy(() => {
		unsubscribeAction();
	});

	$: {
		setNextPollDate(data.kioskData.nextRefreshTimestamp);
	}
</script>

<slot />
