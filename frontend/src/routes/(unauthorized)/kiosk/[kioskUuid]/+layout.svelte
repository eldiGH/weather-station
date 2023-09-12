<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Tabs, { type Tab, type TabsClickEvent } from '$lib/components/Tabs.svelte';

	const urls = ['sensors', 'forecast'];

	const tabs: Tab[] = [
		{ label: 'Czujniki', value: urls[0] },
		{ label: 'Prognoza pogody', value: urls[1] }
	];
</script>

{#if urls.some((url) => $page.url.pathname.endsWith(url))}
	<div>
		<Tabs navigation {tabs} />
	</div>
{/if}
<slot />

<style>
	div {
		font-size: 1.5rem;
		margin-bottom: 2rem;
	}
</style>
