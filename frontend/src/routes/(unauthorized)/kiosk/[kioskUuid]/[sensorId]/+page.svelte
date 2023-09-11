<script lang="ts">
	import HumidityGauge from '$lib/components/HumidityGauge.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import IconInfo from '$lib/components/IconInfo.svelte';
	import Link from '$lib/components/Link.svelte';
	import PressureGauge from '$lib/components/PressureGauge.svelte';
	import ScrollPanel from '$lib/components/ScrollPanel.svelte';
	import TemperatureGauge from '$lib/components/TemperatureGauge.svelte';
	import TopBar from '$lib/components/TopBar.svelte';
	import { formatCreatedAt } from '$lib/helpers/date';
	import type { PageData } from './$types';
	import ChartTabs from '$lib/components/ChartTabs.svelte';

	export let data: PageData;
</script>

<div class="root">
	<TopBar>
		<Link slot="left" noColor class="back" href="./"
			><Icon weight={200} opticalSize={48} icon="arrow_back" /></Link
		>
		<div slot="center" class="sensor-name">{data.sensor.name}</div>
		<ScrollPanel>
			{#if data.sensor.currentData}
				<IconInfo class="timestamp" gap={1} icon="schedule"
					>Ostatnia aktualizacja: {formatCreatedAt(data.sensor.currentData.createdAt)}</IconInfo
				>
				<div class="gauges">
					<TemperatureGauge value={data.sensor.currentData.temperature} />
					<HumidityGauge value={data.sensor.currentData.humidity} />
					<PressureGauge value={data.sensor.currentData.pressure / 100} />
				</div>
				<div class="charts">
					<IconInfo class="header" gap={1} icon="chart_data">Wykresy z ostatnich 24h:</IconInfo>
					<ChartTabs data={data.sensor.data} />
				</div>
			{:else}
				Brak danych
			{/if}
		</ScrollPanel>
	</TopBar>
</div>

<style lang="scss">
	.root {
		padding-bottom: 5rem;

		:global(.back) {
			margin-left: 1rem;
			font-size: 4rem;
			line-height: 1px;
			display: flex;

			font-variation-settings: w;
		}

		:global(.timestamp) {
			font-size: 2rem;
		}

		.gauges {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-around;
			margin: 3rem 0;
		}

		.sensor-name {
			font-size: 2rem;
		}

		.charts {
			:global(.header) {
				font-size: 2rem;
			}
		}
	}
</style>
