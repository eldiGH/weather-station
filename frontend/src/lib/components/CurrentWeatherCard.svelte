<script lang="ts">
	import { formatTemperature, formatUVI, formatUnixTimestamp } from '$lib/helpers/formatters';
	import { getWeatherIcon } from '$lib/helpers/weatherHelper';
	import { Card } from 'agnostic-svelte';
	import type { WeatherCurrent, WeatherDescription } from 'shared/src/index';
	import IconInfo from './IconInfo.svelte';
	import { capitalize } from '$lib/helpers/string';
	import Container from './Container.svelte';
	import WindIndicator from './WindIndicator.svelte';

	export let data: WeatherCurrent;

	let weather: WeatherDescription | null = null;
	$: weather = data.weather[0] ?? null;

	$: formattedUvi = formatUVI(data.uvi);
</script>

<Container>
	<div class="root">
		<div class="header">
			{#if weather}
				<div class="weather-description">
					<div class="img-container">
						<img alt={weather.description} src={getWeatherIcon(weather.icon)} />
					</div>
					<span>({capitalize(weather.description)})</span>
				</div>
			{/if}
			<div class="temperature-and-time">
				{formatTemperature(data.temp)}
				<div class="time">
					<IconInfo gap={0.3} icon="schedule">{formatUnixTimestamp(data.dt)}</IconInfo>
				</div>
			</div>
		</div>
		<div class="content">
			<Card isBorder isRounded>
				Ogólne
				<div class="data-section-container">
					<div class="data-section">
						<IconInfo gap={0.3} icon="humidity_percentage">Wilgotność: {data.humidity}%</IconInfo>
						<IconInfo gap={0.3} icon="compress">Ciśnienie: {data.pressure} hPa</IconInfo>
						<IconInfo gap={0.3} icon="thermometer">
							Odczuwalna temperatura: {formatTemperature(data.feels_like)}
						</IconInfo>
						<IconInfo gap={0.3} icon="visibility">Widoczność: {data.visibility / 1000}km</IconInfo>
						<IconInfo gap={0.3} icon="cloud">Zachmurzenie: {data.clouds}%</IconInfo>
						<IconInfo gap={0.3} icon="water_do"
							>Temp. skraplania rosy: {formatTemperature(data.dew_point)}</IconInfo>
					</div>
				</div>
			</Card>
			<Card isBorder isRounded>
				Słońce
				<div class="data-section-container">
					<div class="data-section">
						<IconInfo gap={0.3} icon="wb_twilight"
							>Wschód słońca: {formatUnixTimestamp(data.sunrise)}</IconInfo>
						<IconInfo gap={0.3} icon="wb_twilight"
							>Zachód słońca: {formatUnixTimestamp(data.sunset)}</IconInfo>
						<IconInfo gap={0.3} icon="wb_sunny" color={formattedUvi.color}
							>Indeks UV: {formattedUvi.label}</IconInfo>
					</div>
				</div>
			</Card>
			<Card isBorder isRounded>
				Wiatr
				<div class="wind">
					<WindIndicator class="wind-indicator" windDirection={data.wind_deg} />
					<IconInfo gap={0.3} icon="air">{data.wind_speed} m/s</IconInfo>
				</div>
			</Card>
		</div>
	</div>
</Container>

<style lang="scss">
	.root {
		display: flex;
		width: 100%;
		flex-direction: column;

		.content {
			display: flex;
			gap: 1rem;
			flex-wrap: wrap;
			justify-content: space-around;

			:global(.card) {
				display: inline-flex;
				flex-direction: column;
				font-size: 2rem;
				gap: 2rem;
				width: auto;
				padding: 2rem;
			}
			.data-section {
				font-size: 1.2rem;
				display: flex;
				flex-direction: column;

				&-container {
					display: flex;
					flex-direction: column;
					flex-grow: 1;
					justify-content: center;
				}
			}

			.wind {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;

				:global(.wind-indicator) {
					width: 5rem;
					height: 5rem;
				}
			}
		}

		.header {
			font-size: 3rem;
			display: flex;
			align-items: center;
			gap: 1rem;
			line-height: 2.5rem;
			margin-bottom: 2rem;
			justify-content: center;

			.temperature-and-time {
				display: flex;
				flex-direction: column;

				.time {
					font-size: 1.2rem;
					line-height: normal;
					align-self: flex-end;
				}
			}

			.weather-description {
				--width: 100px;
				--height: 100px;

				display: flex;
				flex-direction: column;
				font-size: 0.9rem;
				line-height: 0.9rem;
				align-items: center;
				text-align: center;

				width: var(--width);

				.img-container {
					display: inline-flex;
					width: var(--width);
					height: var(--height);
					overflow: hidden;

					justify-content: center;
					align-items: center;

					img {
						width: calc(var(--width) * 1.3);
						height: calc(var(--height) * 1.3);
					}
				}
			}
		}
	}
</style>
