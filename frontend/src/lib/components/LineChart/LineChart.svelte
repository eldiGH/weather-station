<script lang="ts">
	import { Chart } from 'chart.js/auto';
	import { onDestroy, onMount } from 'svelte';

	interface ChartData {
		label: string;
		xAxisData: (number | Date)[];
		yAxisData: (number | Date)[];
	}

	export let config: ChartData;

	let canvas: HTMLCanvasElement;
	let chart: Chart<'line', (number | Date)[]> | null = null;

	onMount(() => {
		chart = new Chart(canvas, {
			type: 'line',
			data: {
				labels: config.xAxisData,
				datasets: [
					{
						label: config.label,
						data: config.yAxisData
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

	onDestroy(() => {
		chart?.destroy();
		chart = null;
	});
</script>

<div>
	<canvas bind:this={canvas} />
</div>
