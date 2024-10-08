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
		scales?: { [key: string]: ScaleOptions<'linear' | 'time'> };
		defaultTooltipFormat?: string;
		tooltipLabelFormatter?: (data: TooltipItem<'line'>) => string;
	}
</script>

<script lang="ts">
	import { Chart, type TooltipItem, type ScaleOptions } from 'chart.js';
	import { onDestroy, onMount } from 'svelte';

	export let config: ChartData;
	export let showTooltip = true;

	let chartCanvas: HTMLCanvasElement;
	let chart: Chart<'line', (number | Date)[]> | null = null;

	let axisCanvas: HTMLCanvasElement;
	let axisChart: Chart<'line', (number | Date)[]> | null = null;

	let scrollDiv: HTMLDivElement;

	const AXIS_CHART_WIDTH = 30;
	const CHART_WIDTH = 2500;
	const CHART_HEIGHT = 400;

	onMount(() => {
		const chartData = {
			labels: config.xAxisData,
			datasets: config.datasets.map(
				({ data, backgroundColor, borderColor, label, borderDash, yAxisID }) => ({
					label,
					data,
					borderColor: borderColor ?? '#f39530',
					backgroundColor: backgroundColor ?? '#f39530',
					borderDash,
					yAxisID,
					tension: 0.5
				})
			)
		};

		chart = new Chart(chartCanvas, {
			type: 'line',
			data: chartData,
			options: {
				responsive: false,
				maintainAspectRatio: false,
				interaction: {
					mode: 'index',
					intersect: false
				},
				layout: {
					padding: {
						top: 10
					}
				},
				scales: {
					...config.scales,
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
					y: {
						...config.scales?.y,
						ticks: {
							display: false
						},
						grid: {
							drawTicks: true,
							tickLength: 20
						}
					}
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
					},
					legend: {
						display: false
					}
				}
			}
		});

		axisChart = new Chart(axisCanvas, {
			type: 'line',
			data: chartData,
			options: {
				scales: {
					x: {
						ticks: {
							display: false
						},
						grid: {
							drawTicks: false
						}
					},
					y: {
						...config.scales?.y,
						afterFit: (ctx) => {
							ctx.width = AXIS_CHART_WIDTH + 4;
							scrollDiv.scrollTo({ behavior: 'smooth', left: scrollDiv.scrollWidth });
						}
					}
				},

				maintainAspectRatio: false,
				layout: {
					padding: {
						bottom: 63.5
					}
				},

				plugins: {
					legend: {
						display: false
					}
				}
			}
		});
	});

	onDestroy(() => {
		chart?.destroy();
		chart = null;

		axisChart?.destroy();
		axisChart = null;
	});
</script>

<div class="container" style={`--chart-width=${CHART_WIDTH}px`}>
	<div class="axis-chart-container" style:width={`${AXIS_CHART_WIDTH}px`}>
		<canvas bind:this={axisCanvas}></canvas>
	</div>
	<div class="chart-container" bind:this={scrollDiv}>
		<div class="chart-wrapper">
			<canvas bind:this={chartCanvas} height={CHART_HEIGHT} width={CHART_WIDTH - AXIS_CHART_WIDTH}
			></canvas>
		</div>
	</div>
</div>

<style lang="scss">
	.container {
		display: flex;

		.chart-container {
			max-width: var(--chart-width);
			overflow-x: scroll;

			.chart-wrapper {
				width: var(--chart-width);
			}
		}
	}
</style>
