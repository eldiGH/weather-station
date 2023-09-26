<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Tabs, { type Tab, type TabsClickEvent } from '$lib/components/Tabs.svelte';
	import Clock from '$lib/components/Clock.svelte';
	import { writable } from 'svelte/store';
	import { setAppContext } from '$lib/helpers/contextHelper';
	import ScrollPanel from '$lib/components/ScrollPanel.svelte';
	import { onDestroy } from 'svelte';
	import { registerActivityChangeHandler } from '$lib/components/ActionPoller.svelte';

	const baseUrl = `/kiosk/${$page.params.kioskUuid}`;
	const sensorsUrl = `${baseUrl}/sensors`;

	const tabs: Tab[] = [
		{ label: 'Czujniki', value: sensorsUrl },
		{ label: 'Prognoza pogody', value: `${baseUrl}/forecast`, to: `${baseUrl}/forecast/current` }
	];

	const tabsVisibilityStore = writable(true);

	setAppContext('kioskMainNavigationTabs', tabsVisibilityStore);

	const { unregister } = registerActivityChangeHandler((active) => {
		if (!active) {
			goto(sensorsUrl, { invalidateAll: false });
		}
	});

	onDestroy(() => {
		unregister();
	});
</script>

<div class="root">
	{#if $tabsVisibilityStore}
		<div class="tabs-container">
			<Tabs navigation {tabs}><Clock /></Tabs>
		</div>
	{/if}
	<div class="content">
		<ScrollPanel>
			<slot />
		</ScrollPanel>
	</div>
</div>

<style lang="scss">
	.root {
		height: 100%;
		display: flex;
		flex-direction: column;

		.tabs-container {
			font-size: 1.5rem;
			z-index: 10;

			position: sticky;
			top: 0;

			background-color: #313537;
		}

		.content {
			min-height: 0;
			flex-grow: 1;
		}
	}
</style>
