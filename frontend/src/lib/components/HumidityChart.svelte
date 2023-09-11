<script lang="ts">
	import LineChart, { type ChartData } from './LineChart.svelte';

	interface HumidityChartData {
		humidity: number;
		createdAt: Date;
	}

	export let data: HumidityChartData[];
	export let showTooltip = true;

	const getChartData = (data: HumidityChartData[]): ChartData => {
		const xAxisData: Date[] = [];
		const yAxisData: number[] = [];

		for (const entry of data) {
			const { createdAt, humidity } = entry;

			yAxisData.push(humidity);
			xAxisData.push(createdAt);
		}

		return { label: 'Wilgotność', xAxisData, yAxisData };
	};

	let chartData: ChartData;
	$: chartData = getChartData(data);
</script>

<LineChart {showTooltip} config={chartData} />
