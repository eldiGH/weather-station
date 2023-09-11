<script lang="ts">
	import { Card } from 'agnostic-svelte';
	import type { GetLatestBME68XDataEntryResponse, SensorResponseWithCurrentData } from 'shared';
	import Icon from './Icon.svelte';
	import IconInfo from './IconInfo.svelte';
	import Link from './Link.svelte';
	import { page } from '$app/stores';
	import { format, isBefore, subDays } from 'date-fns';
	import { formatCreatedAt } from '$lib/helpers/date';

	export let sensor: SensorResponseWithCurrentData;

	const convertReadingToVoltage = (reading: number) => {
		const conversionFactor = (3.3 / 4096) * 3;

		return reading * conversionFactor;
	};

	const formatData = (data?: GetLatestBME68XDataEntryResponse) => {
		if (!data) {
			const label = 'Brak danych';

			return {
				temperature: label,
				humidity: label,
				pressure: label,
				batteryPercentage: label,
				createdAt: label
			};
		}

		const { temperature, humidity, pressure, batteryPercentage, createdAt } = data;

		return {
			temperature: `${temperature?.toFixed(1)}°C`,
			humidity: `${humidity.toFixed(1)}%`,
			pressure: `${Math.round(pressure / 100)} hPa`,
			batteryPercentage: `${convertReadingToVoltage(batteryPercentage).toFixed(2)}V`,
			createdAt: formatCreatedAt(createdAt)
		};
	};

	$: formattedData = formatData(sensor.currentData);
</script>

<Link noColor href={`${$page.url.pathname}/${sensor.id}`}>
	<div class="root">
		<Card isBorder isRounded isShadow>
			<div class="card-content">
				<div class="header">{sensor.name}</div>
				<div class="info-wrapper">
					<div>
						<IconInfo weight={200} gap={0.5} icon="device_thermostat">
							{formattedData.temperature}
						</IconInfo>
						<IconInfo weight={200} gap={0.5} icon="humidity_percentage">
							{formattedData.humidity}
						</IconInfo>
						<IconInfo weight={200} gap={0.5} icon="compress">
							{formattedData.pressure}
						</IconInfo>
						<IconInfo weight={200} gap={0.5} icon="battery_5_bar">
							{formattedData.batteryPercentage}
						</IconInfo>
						<IconInfo weight={200} gap={0.5} icon="schedule">
							{formattedData.createdAt}
						</IconInfo>
					</div>
				</div>
			</div>
		</Card>
	</div>
</Link>

<style lang="scss">
	.root {
		font-size: 1.5rem;
		width: 20rem;

		.card-content {
			width: 100%;
			padding: 0.5rem 1.5rem;

			.header {
				font-size: 2rem;
				display: flex;
				justify-content: center;
				margin-bottom: 1.5rem;
				word-break: break-all;
				text-align: center;
			}

			.info-wrapper {
				display: flex;
				width: 100%;
				height: 100%;
				justify-content: center;
			}
		}
	}
</style>
