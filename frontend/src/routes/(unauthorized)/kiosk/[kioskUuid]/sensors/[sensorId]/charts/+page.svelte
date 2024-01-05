<script lang="ts">
	import ChartTabs from '$lib/components/ChartTabs.svelte';
	import IconInfo from '$lib/components/IconInfo.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="charts">
	<IconInfo class="header" gap={1} icon="chart_data">Wykresy z ostatnich 24h:</IconInfo>
	<ChartTabs data={data.sensorData.bme68XData} />
</div>

<style lang="scss">
	.charts {
		:global(.header) {
			font-size: 2rem;
		}
	}
</style>
