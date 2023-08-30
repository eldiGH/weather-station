<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Chart from 'chart.js/auto';
	import 'chartjs-adapter-date-fns';
	import type { GetBME68XDataResponse, GetLatestBME68XDataEntryResponse } from 'shared';
	import type { BME68XSensorData } from '@prisma/client';

	export let data: PageData;
	let canvas: HTMLCanvasElement;

	$: latestData = data.dataSet.at(-1);
	$: roundedData = latestData ? roundBME68XSensorData(latestData, 2) : null;

	const roundToPrecision = (n: number, precision: number) => {
		const base = Math.pow(10, precision);

		return Math.round(n * base) / base;
	};

	const roundBME68XSensorData = (
		data: GetLatestBME68XDataEntryResponse,
		places: number
	): GetLatestBME68XDataEntryResponse => {
		return {
			temperature: roundToPrecision(data.temperature, places),
			createdAt: data.createdAt,
			gasResistance: roundToPrecision(data.gasResistance, places),
			humidity: roundToPrecision(data.humidity, places),
			pressure: roundToPrecision(data.pressure / 100, places)
		};
	};

	onMount(() => {
		const chart = new Chart(canvas, {
			type: 'line',
			data: {
				labels: data.dataSet.map(({ createdAt }) => createdAt),
				datasets: [
					{
						label: 'Temperature',
						data: data.dataSet.map(({ temperature }) => temperature)
					}
				]
			},
			options: {
				scales: {
					x: {
						type: 'time',
						time: {
							unit: 'minute',
							displayFormats: {
								minute: 'HH:mm'
							}
						}
					}
				}
			}
		});
	});
</script>

{#if roundedData}
	<div>
		<div>Temperatura: {roundedData.temperature} °C</div>
		<div>Wilgotność: {roundedData.humidity}%</div>
		<div>Ciśnienie: {roundedData.pressure} hPa</div>
		<div>Oporność gazów: {roundedData.gasResistance} Ohms</div>
		<div>
			Ostatnie dane z: {roundedData.createdAt.getHours()}:{roundedData.createdAt.getMinutes()}
		</div>
	</div>
{/if}
<div>
	<canvas bind:this={canvas} />
</div>
