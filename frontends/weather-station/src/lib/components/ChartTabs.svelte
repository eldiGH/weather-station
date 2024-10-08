<script lang="ts">
	import Tabs from './Tabs.svelte';
	import { createTabs } from '$lib/stores/tabs';
	import TemperatureChart from './TemperatureChart.svelte';
	import HumidityChart from './HumidityChart.svelte';
	import PressureChart from './PressureChart.svelte';
	import type { AppRouterOutputs } from 'backend/trpc';

	const tabsStore = createTabs(3);

	export let data: AppRouterOutputs['kiosk']['getKioskSensorDetails']['bme68xData'];
	export let showTooltip = true;
</script>

<Tabs
	{tabsStore}
	tabs={[{ label: 'Temperatura' }, { label: 'Wilgotność' }, { label: 'Ciśnienie' }]} />
{#if $tabsStore === 0}
	<TemperatureChart {showTooltip} {data} />
{:else if $tabsStore === 1}
	<HumidityChart {showTooltip} {data} />
{:else if $tabsStore === 2}
	<PressureChart {showTooltip} {data} />
{/if}
