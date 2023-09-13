<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import { invalidateDataWatcherFactory } from '$lib/helpers/data';

	export let data: LayoutData;

	const invalidateDataWatcher = invalidateDataWatcherFactory('api:kioskData');

	onMount(() => {
		invalidateDataWatcher.onMount();
	});

	onDestroy(() => {
		invalidateDataWatcher.onDestroy();
	});

	$: {
		invalidateDataWatcher.onDateUpdate(data.kioskData.nextRefreshTimestamp);
	}
</script>

<slot />
