<script lang="ts" context="module">
	export interface TemperatureChartData {
		temperature: number;
		createdAt: Date;
	}
</script>

<script lang="ts">
	import LineChart, { type ChartData } from './LineChart.svelte';

	export let data: TemperatureChartData[];
	export let showTooltip = true;

	const getChartData = (data: TemperatureChartData[]): ChartData => {
		const xAxisData: Date[] = [];
		const yAxisData: number[] = [];

		for (const entry of data) {
			const { createdAt, temperature } = entry;

			yAxisData.push(temperature);
			xAxisData.push(createdAt);
		}

		return { xAxisData, datasets: [{ label: 'Temperatura', data: yAxisData }] };
	};

	let chartData: ChartData;
	$: chartData = getChartData(data);
</script>

<LineChart {showTooltip} config={chartData} />
