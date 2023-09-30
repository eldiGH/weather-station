<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Tabs, { type Tab } from '$lib/components/Tabs.svelte';
	import Clock from '$lib/components/Clock.svelte';
	import { writable } from 'svelte/store';
	import { setAppContext } from '$lib/helpers/contextHelper';
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

{#if $tabsVisibilityStore}
	<div class="tabs-container">
		<Tabs navigation {tabs}><Clock /></Tabs>
	</div>
{/if}

<slot />

<style lang="scss">
	.tabs-container {
		font-size: 1.5rem;
		z-index: 10;

		position: sticky;
		top: 0;

		background-color: #313537;
	}
</style>
