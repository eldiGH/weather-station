<script lang="ts">
	import { capitalize } from '$lib/helpers/string';
	import { format, fromUnixTime } from 'date-fns';
	import type { WeatherDaily, WeatherHourly } from 'shared';
	import IconInfo from '../IconInfo.svelte';
	import { getWeatherIcon } from '$lib/helpers/weatherHelper';
	import { formatTemperature } from '$lib/helpers/formatters';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let daysOrHours: (WeatherDaily | WeatherHourly)[];

	$: isDaily = typeof daysOrHours[0].temp !== 'number';

	$: baseUrl = `/kiosk/${$page.params.kioskUuid}/forecast/${isDaily ? 'daily' : 'hourly'}`;
</script>

<div class="root">
	<table>
		{#each daysOrHours as dayOrHour, i}
			<tr on:click={() => goto(`${baseUrl}/${i}`)}>
				{#if isDaily}
					<td>{i === 0 ? 'Dzisiaj' : capitalize(format(fromUnixTime(dayOrHour.dt), 'EEEE'))}</td>
				{:else}
					<td>{format(fromUnixTime(dayOrHour.dt), 'HH:mm')}</td>
				{/if}
				<td><IconInfo icon="humidity_high">{Math.round(dayOrHour.pop * 100)}%</IconInfo></td>
				<td>
					{#if dayOrHour.weather[0]}
						<div class="weather-description">
							<img
								alt={dayOrHour.weather[0].description}
								src={getWeatherIcon(dayOrHour.weather[0].icon)} />{capitalize(
								dayOrHour.weather[0].description
							)}
						</div>
					{/if}
				</td>
				{#if typeof dayOrHour.temp !== 'number'}
					<td>{formatTemperature(dayOrHour.temp.max)}</td>
					<td class="min-temperature">{formatTemperature(dayOrHour.temp.min)}</td>
				{:else}
					<td>{formatTemperature(dayOrHour.temp)}</td>
				{/if}
			</tr>
		{/each}
	</table>
</div>

<style lang="scss">
	.root {
		display: flex;
		justify-content: space-around;
		color: rgba(255, 255, 255, 0.8);

		table {
			tr {
				border-bottom: 1px solid rgba(255, 255, 255, 0.06);

				cursor: pointer;

				@media only screen and (min-width: 800px) {
					&:hover {
						background-color: rgba(255, 255, 255, 0.1);
					}
				}
			}

			tr:last-child {
				border-bottom: none;
			}

			font-size: 1.2rem;

			td {
				padding: 0.5rem;
				vertical-align: middle;
				user-select: none;

				&.min-temperature {
					color: rgba(255, 255, 255, 0.5);
				}
			}

			.weather-description {
				display: flex;
				align-items: center;

				img {
					width: 3rem;
					height: 3rem;
				}
			}
		}
	}
</style>
