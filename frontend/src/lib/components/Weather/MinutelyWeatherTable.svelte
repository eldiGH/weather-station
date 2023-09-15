<script lang="ts">
	import type { WeatherMinutely } from 'shared';
	import LineChart from '../LineChart.svelte';
	import { fromUnixTime } from 'date-fns';

	export let minutes: WeatherMinutely[];

	console.log(minutes);

	const getChartData = (minutes: WeatherMinutely[]) => {
		const xAxisData: Date[] = [];
		const yAxisData: number[] = [];

		for (const entry of minutes) {
			xAxisData.push(fromUnixTime(entry.dt));
			yAxisData.push(entry.precipitation * 100);
		}

		return { xAxisData, yAxisData };
	};

	$: chartData = getChartData(minutes);
</script>

<LineChart
	config={{
		xAxisData: chartData.xAxisData,
		datasets: [
			{
				label: 'Szansa na deszcz',
				data: chartData.yAxisData,
				backgroundColor: '#315de0',
				borderColor: '#315de0',
				borderDash: [5, 5]
			}
		],
		scales: { y: { min: 0, max: 100 } },
		defaultTooltipFormat: 'HH:mm'
	}} />
