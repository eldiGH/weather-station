<script lang="ts">
	import { formatTemperature } from '$lib/helpers/formatters';
	import { capitalize } from '$lib/helpers/string';
	import { getWeatherIcon } from '$lib/helpers/weatherHelper';
	import IconInfo from '@shared/components/IconInfo.svelte';
	import { format, fromUnixTime } from 'date-fns';
	import type { IconType } from '@shared/types/IconType';
	import type { WeatherDescription } from 'backend/types';

	export let weather: WeatherDescription | undefined;
	export let temperature: number;
	export let timestamp: number;
	export let timeFormat: string;
	export let timeIcon: IconType = 'schedule';
</script>

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
		{formatTemperature(temperature)}
		<div class="time">
			<IconInfo gap={0.3} icon={timeIcon}>{format(fromUnixTime(timestamp), timeFormat)}</IconInfo>
		</div>
	</div>
</div>

<style lang="scss">
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

				text-transform: capitalize;
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
</style>
