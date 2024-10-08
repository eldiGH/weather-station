<script lang="ts">
	import { formatCreatedAt } from '$lib/helpers/date';
	import type { MinMaxReadingResult } from '$lib/types/MinMaxReadingResult';
	import type { AppRouterOutputs } from 'backend/trpc';
	import MinMaxCard from './MinMaxCard.svelte';

	type DataType = AppRouterOutputs['kiosk']['getKioskSensorDetails']['bme68xData'];
	interface SummaryReadingsResult {
		temperature: MinMaxReadingResult;
		humidity: MinMaxReadingResult;
		pressure: MinMaxReadingResult;
	}

	const { data }: { data: DataType } = $props();

	const updateResult = (result: MinMaxReadingResult, reading: number, at: Date) => {
		if (reading > result.max.value) {
			result.max = { value: reading, at };
		}
		if (reading < result.min.value) {
			result.min = { value: reading, at };
		}
	};

	const calculateMinMaxValues = (data: DataType) => {
		const now = new Date();

		const result: SummaryReadingsResult = {
			temperature: {
				max: { value: -Infinity, at: now },
				min: { value: Infinity, at: now }
			},
			pressure: {
				max: { value: -Infinity, at: now },
				min: { value: Infinity, at: now }
			},
			humidity: {
				max: { value: -Infinity, at: now },
				min: { value: Infinity, at: now }
			}
		};

		for (const item of data) {
			updateResult(result.temperature, item.temperature, item.createdAt);
			updateResult(result.pressure, item.pressure, item.createdAt);
			updateResult(result.humidity, item.humidity, item.createdAt);
		}

		const parsedResult = {
			temperature: {
				min: {
					value: `${result.temperature.min.value.toFixed(1)} °C`,
					at: formatCreatedAt(result.temperature.min.at)
				},
				max: {
					value: `${result.temperature.max.value.toFixed(1)} °C`,
					at: formatCreatedAt(result.temperature.max.at)
				}
			},
			humidity: {
				min: {
					value: `${result.humidity.min.value.toFixed(1)}%`,
					at: formatCreatedAt(result.humidity.min.at)
				},
				max: {
					value: `${result.humidity.max.value.toFixed(1)}%`,
					at: formatCreatedAt(result.humidity.max.at)
				}
			},
			pressure: {
				min: {
					value: `${(result.pressure.min.value / 100).toFixed(1)} hPa`,
					at: formatCreatedAt(result.pressure.min.at)
				},
				max: {
					value: `${(result.pressure.max.value / 100).toFixed(1)} hPa`,
					at: formatCreatedAt(result.pressure.max.at)
				}
			}
		};

		return parsedResult;
	};

	const { temperature, humidity, pressure } = $derived(calculateMinMaxValues(data));
</script>

<div class="container">
	<MinMaxCard label="Temperatura" icon="device_thermostat" readingResult={temperature} />
	<MinMaxCard label="Wilgotność" icon="humidity_high" readingResult={humidity} />
	<MinMaxCard label="Ciśnienie" icon="compress" readingResult={pressure} />
</div>

<style lang="scss">
	.container {
		display: flex;
		justify-content: space-around;
		gap: 1rem;
		flex-wrap: wrap;
		margin-top: 2rem;
	}
</style>
