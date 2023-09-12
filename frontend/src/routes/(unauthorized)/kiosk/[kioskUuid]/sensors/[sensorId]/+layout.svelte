<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import Link from '$lib/components/Link.svelte';
	import ScrollPanel from '$lib/components/ScrollPanel.svelte';
	import Tabs, { type Tab } from '$lib/components/Tabs.svelte';
	import TopBar from '$lib/components/TopBar.svelte';
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';

	export let data: LayoutData;

	console.log($page);

	const { kioskUuid, sensorId } = $page.params;

	const baseRoute = `/kiosk/${kioskUuid}/sensors/${sensorId}`;

	const urls = [baseRoute, `${baseRoute}/charts`];

	const tabs: Tab[] = [
		{ label: 'Szczegóły', value: urls[0], exactRoute: true },
		{ label: 'Wykresy', value: urls[1], exactRoute: true }
	];
</script>

<TopBar>
	<Link slot="left" noColor class="back-button" href={baseRoute?.replace(`/${sensorId}`, '') ?? ''}
		><Icon weight={200} opticalSize={48} icon="arrow_back" /></Link
	>
	<div slot="center" class="sensor-name">{data.sensor.name}</div>
	<ScrollPanel>
		<div class="scroll-panel-content">
			<div class="tabs-container">
				<Tabs navigation {tabs} />
			</div>
			<slot />
		</div>
	</ScrollPanel>
</TopBar>

<style lang="scss">
	:global(.back-button) {
		margin-left: 1rem;
		font-size: 4rem;
		line-height: 3rem;
		display: flex;

		font-variation-settings: w;
	}

	.scroll-panel-content {
		padding-bottom: 5rem;
		.tabs-container {
			margin-bottom: 2rem;
		}
	}

	.sensor-name {
		font-size: 2rem;
	}
</style>
