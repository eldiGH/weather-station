<script lang="ts">
	import type { WeatherMinutely } from 'shared';
	import LineChart from '../LineChart.svelte';
	import { fromUnixTime } from 'date-fns';

	export let minutes: WeatherMinutely[];

	const getChartData = (minutes: WeatherMinutely[]) => {
		const xAxisData: Date[] = [];
		const yAxisData: number[] = [];

		for (const entry of minutes) {
			xAxisData.push(fromUnixTime(entry.dt));
			yAxisData.push(entry.precipitation);
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
				label: 'Ilość opadów',
				data: chartData.yAxisData,
				backgroundColor: '#315de0',
				borderColor: '#315de0',
				borderDash: [5, 5]
			}
		],
		defaultTooltipFormat: 'HH:mm',
		tooltipLabelFormatter: (data) => `${data.formattedValue} mm/h`,
		scales: { y: { min: 0 } }
	}} />
