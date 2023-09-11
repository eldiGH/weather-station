<script lang="ts" context="module">
	export interface PressureChartData {
		pressure: number;
		createdAt: Date;
	}
</script>

<script lang="ts">
	import LineChart, { type ChartData } from './LineChart.svelte';

	export let data: PressureChartData[];
	export let showTooltip = true;

	const getChartData = (data: PressureChartData[]): ChartData => {
		const xAxisData: Date[] = [];
		const yAxisData: number[] = [];

		for (const entry of data) {
			const { createdAt, pressure } = entry;

			yAxisData.push(pressure / 100);
			xAxisData.push(createdAt);
		}

		return { label: 'Ciśnienie', xAxisData, yAxisData };
	};

	let chartData: ChartData;
	$: chartData = getChartData(data);
</script>

<LineChart {showTooltip} config={chartData} />
