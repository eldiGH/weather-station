<script lang="ts">
	import ChartTabs from '$lib/components/ChartTabs.svelte';
	import DailyStats from '$lib/components/DailyStats.svelte';
	import IconInfo from '@shared/components/IconInfo.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="charts">
	<div style="padding-top: 2rem;"></div>
	<IconInfo class="header" gap={1} icon="query_stats">Statystyki</IconInfo>
	<DailyStats data={data.sensorData.bme68xData} />
	<div style="padding-top: 2rem;"></div>
	<IconInfo class="header" gap={1} icon="chart_data">Wykresy</IconInfo>
	<div style="padding-top: 0.5rem;"></div>
	<ChartTabs data={data.sensorData.bme68xData} />
</div>

<style lang="scss">
	.charts {
		:global(.header) {
			font-size: 2rem;
		}
	}
</style>
