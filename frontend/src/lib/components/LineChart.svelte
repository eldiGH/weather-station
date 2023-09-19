<script lang="ts" context="module">
	export interface ChartDataset {
		label?: string;
		data: number[];
		borderColor?: string;
		backgroundColor?: string;
		borderDash?: [number, number];
		yAxisID?: string;
	}

	export interface ChartData {
		xAxisData: Date[];
		datasets: ChartDataset[];
		scales?: _DeepPartialObject<{
			[key: string]: ScaleOptionsByType<keyof CartesianScaleTypeRegistry>;
		}>;
		defaultTooltipFormat?: string;
		tooltipLabelFormatter?: (data: TooltipItem<'line'>) => string;
	}
</script>

<script lang="ts">
	import {
		Chart,
		type CartesianScaleTypeRegistry,
		type ScaleOptionsByType,
		type TooltipItem
	} from 'chart.js/auto';
	import type { _DeepPartialObject } from 'chart.js/dist/types/utils';
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
				datasets: config.datasets.map(
					({ data, backgroundColor, borderColor, label, borderDash, yAxisID }) => ({
						label,
						data,
						borderColor: borderColor ?? '#f39530',
						backgroundColor: backgroundColor ?? '#f39530',
						borderDash,
						yAxisID
					})
				)
			},
			options: {
				responsive: true,
				interaction: {
					mode: 'index',
					intersect: false
				},
				scales: {
					x: {
						type: 'time',
						time: {
							unit: 'minute',
							displayFormats: {
								minute: 'HH:mm'
							},
							tooltipFormat: config.defaultTooltipFormat ?? 'HH:mm dd.MM'
						}
					},
					...config.scales
				},
				plugins: {
					tooltip: {
						enabled: showTooltip,
						bodyFont: {
							family: 'Roboto',
							size: 16
						},
						titleFont: {
							family: 'Roboto',
							size: 20
						},
						callbacks: {
							label: config.tooltipLabelFormatter
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
