<script lang="ts">
	import Tabs, { type Tab } from '$lib/components/Tabs.svelte';
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import { Link, Icon, TopBar, Container } from '@shared/ui/components';

	export let data: LayoutData;

	const { kioskUuid, sensorId } = $page.params;

	const baseRoute = `/kiosk/${kioskUuid}/sensors/${sensorId}`;

	const urls = [baseRoute, `${baseRoute}/charts`];

	const tabs: Tab[] = [
		{ label: 'Szczegóły', value: urls[0], exactRoute: true },
		{ label: '24h', value: urls[1], exactRoute: true }
	];
</script>

{#snippet left()}
	<Link noColor class="back-button" href={baseRoute.replace(`/${sensorId}`, '')}
		><Icon weight={200} opticalSize={48} icon="arrow_back" /></Link>
{/snippet}

{#snippet center()}
	<div class="sensor-name">{data.sensor.name}</div>
{/snippet}

<TopBar {left} {center} />
<Container pt={2} pb={2}>
	<div class="tabs-container">
		<Tabs navigation {tabs} />
	</div>
	<slot />
</Container>

<style lang="scss">
	:global(.back-button) {
		margin-left: 1rem;
		font-size: 4rem;
		line-height: 3rem;
		display: flex;

		font-variation-settings: w;
	}

	.sensor-name {
		font-size: 2rem;
	}
</style>
