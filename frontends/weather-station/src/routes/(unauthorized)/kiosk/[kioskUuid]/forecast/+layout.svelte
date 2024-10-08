<script lang="ts">
	import { page } from '$app/stores';
	import Tabs, { type Tab } from '$lib/components/Tabs.svelte';
	import { onDestroy } from 'svelte';
	import type { LayoutData } from './$types';
	import { subscribeAction } from 'frontend.shared/components/ActionPoller';

	export let data: LayoutData;

	const { setNextPollDate, unsubscribeAction } = subscribeAction('api:kioskForecast');

	onDestroy(() => {
		unsubscribeAction();
	});

	$: {
		setNextPollDate(data.nextRefreshTimestamp);
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
	<slot />
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
	}
</style>
