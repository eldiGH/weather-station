<script lang="ts">
	import Tabs from './Tabs.svelte';
	import { createTabs } from '$lib/stores/tabs';
	import TemperatureChart from './TemperatureChart.svelte';
	import type { GetBME68XDataResponse } from 'shared';
	import HumidityChart from './HumidityChart.svelte';
	import PressureChart from './PressureChart.svelte';

	const tabsStore = createTabs(3);

	export let data: GetBME68XDataResponse;
	export let showTooltip = true;
</script>

<Tabs {tabsStore} tabNames={['Temperatura', 'Wilgotność', 'Ciśnienie']} />
{#if $tabsStore === 0}
	<TemperatureChart {showTooltip} {data} />
{:else if $tabsStore === 1}
	<HumidityChart {showTooltip} {data} />
{:else if $tabsStore === 2}
	<PressureChart {showTooltip} {data} />
{/if}
