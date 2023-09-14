<script lang="ts" context="module">
	export interface ChartData {
		label: string;
		xAxisData: (number | Date)[];
		yAxisData: (number | Date)[];
		minY?: number;
		maxY?: number;
	}
</script>

<script lang="ts">
	import { Chart } from 'chart.js/auto';
	import { onDestroy, onMount } from 'svelte';

	export let config: ChartData;
	export let showTooltip = true;

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
						data: config.yAxisData,
						borderColor: '#f39530',
						backgroundColor: '#f39530'
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
					},
					y: {
						...(config.minY ? { min: config.minY } : {}),
						...(config.maxY ? { max: config.maxY } : {})
					}
				},
				plugins: {
					tooltip: {
						enabled: showTooltip
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
