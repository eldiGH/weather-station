<script lang="ts">
	import type { WeatherMinutely } from 'shared';
	import LineChart from './LineChart.svelte';
	import { fromUnixTime } from 'date-fns';

	export let minutes: WeatherMinutely[];

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
		yAxisData: chartData.yAxisData,
		label: 'Szansa na deszcz',
		minY: 0,
		maxY: 100
	}} />
