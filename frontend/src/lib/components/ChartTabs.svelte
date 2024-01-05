<script lang="ts">
	import Tabs from './Tabs.svelte';
	import { createTabs } from '$lib/stores/tabs';
	import TemperatureChart from './TemperatureChart.svelte';
	import HumidityChart from './HumidityChart.svelte';
	import PressureChart from './PressureChart.svelte';
	import type { GetLatestBME68xDataEntryOutput } from 'backend/schemas';

	const tabsStore = createTabs(3);

	export let data: GetLatestBME68xDataEntryOutput[];
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
