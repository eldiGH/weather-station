<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Tabs, { type Tab } from '$lib/components/Tabs.svelte';
	import Clock from '$lib/components/Clock.svelte';
	import { onDestroy } from 'svelte';
	import { registerActivityChangeHandler } from '$lib/components/ActionPoller.svelte';

	const baseUrl = `/kiosk/${$page.params.kioskUuid}`;
	const sensorsUrl = `${baseUrl}/sensors`;

	const tabs: Tab[] = [
		{ label: 'Czujniki', value: sensorsUrl },
		{ label: 'Prognoza pogody', value: `${baseUrl}/forecast`, to: `${baseUrl}/forecast/current` }
	];

	const { unregister } = registerActivityChangeHandler(async (active) => {
		if (!active) {
			await goto(sensorsUrl, { invalidateAll: false });

			window.scrollTo({ behavior: 'smooth', top: 0 });
		}
	});

	$: console.log($page);
	$: areTabsVisible = !/\/kiosk\/.*?\/sensors\/\d/.test($page.url.pathname);

	onDestroy(() => {
		unregister();
	});
</script>

{#if areTabsVisible}
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
