<script lang="ts">
	import LineChart, { type ChartDataset } from '$lib/components/LineChart.svelte';
	import ScrollPanel from '$lib/components/ScrollPanel.svelte';
	import Tabs from '$lib/components/Tabs.svelte';
	import DailyOrHourlyWeatherTable from '$lib/components/Weather/DailyOrHourlyWeatherTable.svelte';
	import { createTabs } from '$lib/stores/tabs';
	import { fromUnixTime, subHours } from 'date-fns';
	import type { PageData } from './$types';

	export let data: PageData;
	const tabsStore = createTabs(2);

	const getDatasets = (data: PageData) => {
		const temperatureDataset: ChartDataset = {
			label: 'Temperatura',
			data: [],
			yAxisID: 'y'
		};
		const precipitationDataset: ChartDataset = {
			label: 'Szansa na deszcz',
			data: [],
			backgroundColor: '#315de0',
			borderColor: '#315de0',
			borderDash: [5, 5],
			yAxisID: 'y1'
		};
		const xAxisData: Date[] = [];

		for (const hour of data.hourly) {
			xAxisData.push(fromUnixTime(hour.dt));

			temperatureDataset.data.push(hour.temp);
			precipitationDataset.data.push(Math.round(hour.pop * 100));
		}

		return {
			datasets: [temperatureDataset, precipitationDataset],
			xAxisData
		};
	};

	$: chartData = getDatasets(data);
</script>

<div class="root">
	<Tabs {tabsStore} tabs={[{ label: 'Tabela' }, { label: 'Wykres' }]} />
	<div class="scroll-panel-container">
		<ScrollPanel>
			<div class="content">
				{#if $tabsStore === 0}
					<DailyOrHourlyWeatherTable daysOrHours={data.hourly} />
				{:else}
					<LineChart
						config={{
							...chartData,
							scales: {
								x: {
									type: 'time',
									time: {
										unit: 'hour',
										round: 'hour',
										displayFormats: { hour: 'HH:mm' },
										tooltipFormat: 'HH:mm'
									},
									display: true
								},
								y1: {
									type: 'linear',
									min: 0,
									max: 100,
									grid: { drawOnChartArea: false },
									position: 'right'
								}
							}
						}} />
				{/if}
			</div>
		</ScrollPanel>
	</div>
</div>

<style lang="scss">
	.root {
		height: 100%;
		display: flex;
		flex-direction: column;

		.scroll-panel-container {
			min-height: 0;
			flex-grow: 1;

			.content {
				padding: 1rem 0;
			}
		}
	}
</style>
