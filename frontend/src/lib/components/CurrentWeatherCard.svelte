<script lang="ts">
	import { formatTemperature, formatUVI, formatUnixTimestamp } from '$lib/helpers/formatters';
	import { getWeatherIcon } from '$lib/helpers/weatherHelper';
	import { Card } from 'agnostic-svelte';
	import type { WeatherCurrent } from 'shared/src/index';
	import IconInfo from './IconInfo.svelte';
	import { format, fromUnixTime } from 'date-fns';

	export let data: WeatherCurrent;

	$: weather = data.weather[0] ?? null;

	$: formattedUvi = formatUVI(data.uvi);
</script>

<div class="root">
	<Card isBorder isRounded isShadow>
		<div class="card-content">
			<div class="header">
				{#if weather}
					<img alt={weather.description} src={getWeatherIcon(weather.icon)} />
				{/if}
				<div class="temperature-and-time">
					{formatTemperature(data.temp)}
					<div class="time">
						<IconInfo gap={0.3} icon="schedule">{formatUnixTimestamp(data.dt)}</IconInfo>
					</div>
				</div>
			</div>
			<div class="current-weather-data">
				<IconInfo gap={0.3} icon="thermometer">
					Odczuwalna temperatura: {formatTemperature(data.feels_like)}
				</IconInfo>
				<IconInfo gap={0.3} icon="humidity_percentage">Wilgotność: {data.humidity}%</IconInfo>
				<IconInfo gap={0.3} icon="compress">Ciśnienie: {data.pressure} hPa</IconInfo>
				<IconInfo gap={0.3} icon="visibility">Widoczność: {data.visibility / 1000}km</IconInfo>
				<IconInfo gap={0.3} icon="cloud">Zachmurzenie: {data.clouds}%</IconInfo>
				<IconInfo gap={0.3} icon="air">Prędkość wiatru: {data.wind_speed} m/s</IconInfo>
				<IconInfo gap={0.3} icon="east">Kierunek wiatru: {data.wind_deg}°</IconInfo>
				<IconInfo gap={0.3} icon="wb_twilight"
					>Wschód słońca: {formatUnixTimestamp(data.sunrise)}</IconInfo>
				<IconInfo gap={0.3} icon="wb_twilight"
					>Zachód słońca: {formatUnixTimestamp(data.sunset)}</IconInfo>
				<IconInfo gap={0.3} icon="water_do"
					>Temperatura skraplania rosy: {formatTemperature(data.dew_point)}</IconInfo>
				<IconInfo gap={0.3} icon="wb_sunny" color={formattedUvi.color}
					>Indeks UV: {formattedUvi.label}</IconInfo>
			</div>
		</div>
	</Card>
</div>

<style lang="scss">
	.root {
		display: inline-flex;

		.card-content {
			padding: 2rem;
			font-size: 1.2rem;

			.current-weather-data {
				display: flex;
				flex-direction: column;
				gap: 0.2rem;
			}
		}

		.header {
			font-size: 3rem;
			display: flex;
			align-items: center;
			gap: 1rem;
			line-height: 2.5rem;

			.temperature-and-time {
				display: flex;
				flex-direction: column;

				.time {
					font-size: 1.2rem;
					line-height: normal;
					align-self: flex-end;
				}
			}
		}
	}
</style>
