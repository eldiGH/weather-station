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
		const temperatureMaxDataset: ChartDataset = {
			label: 'Temperatura max',
			data: [],
			yAxisID: 'y'
		};
		const temperatureMinDataset: ChartDataset = {
			label: 'Temperatura min',
			data: [],
			yAxisID: 'y',
			backgroundColor: '#b56f24',
			borderColor: '#b56f24'
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

		for (const day of data.daily) {
			xAxisData.push(fromUnixTime(day.dt));

			temperatureMaxDataset.data.push(day.temp.max);
			temperatureMinDataset.data.push(day.temp.min);
			precipitationDataset.data.push(Math.round(day.pop * 100));
		}

		return {
			datasets: [temperatureMaxDataset, temperatureMinDataset, precipitationDataset],
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
					<DailyOrHourlyWeatherTable daysOrHours={data.daily} />
				{:else}
					<LineChart
						config={{
							...chartData,
							scales: {
								x: {
									type: 'time',
									time: {
										unit: 'day',
										round: 'day',
										displayFormats: { day: 'EEEE dd.MM' },
										tooltipFormat: 'EEEE dd.MM'
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
