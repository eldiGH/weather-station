<script lang="ts">
	import { page } from '$app/stores';
	import Tabs, { type Tab } from '$lib/components/Tabs.svelte';
	import { invalidateDataWatcherFactory } from '$lib/helpers/data';
	import { onDestroy, onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import ScrollPanel from '$lib/components/ScrollPanel.svelte';

	export let data: LayoutData;

	const invalidateDataWatcher = invalidateDataWatcherFactory('api:kioskForecast');

	onMount(() => {
		invalidateDataWatcher.onMount();
	});

	onDestroy(() => {
		invalidateDataWatcher.onDestroy();
	});

	$: {
		invalidateDataWatcher.onDateUpdate(data.nextRefreshTimestamp);
	}

	const baseUrl = `/kiosk/${$page.params.kioskUuid}/forecast`;

	const tabs: Tab[] = [
		{ label: 'Teraz', value: `${baseUrl}/current` },
		{ label: 'Minutowa', value: `${baseUrl}/minutely` },
		{ label: 'Godzinowa', value: `${baseUrl}/hourly` },
		{ label: 'Dzienna', value: `${baseUrl}/daily` }
	];
</script>

<div class="root">
	<div class="tabs">
		<Tabs vertical navigation {tabs} />
	</div>
	<ScrollPanel>
		<div class="content">
			<slot />
		</div>
	</ScrollPanel>
</div>

<style lang="scss">
	.root {
		display: flex;
		height: 100%;

		.tabs {
			display: flex;
			align-items: center;
			border-right: 1px solid grey;
			font-size: 1.2rem;
		}

		.content {
			min-height: 100%;
			height: 0;
		}
	}
</style>
