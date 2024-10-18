<script lang="ts">
	import { formatTemperature, formatUVI } from '$lib/helpers/formatters';
	import type IconInfo from '@shared/components/IconInfo.svelte';
	import Container from '@shared/components/Container.svelte';
	import WindCard from './WindCard.svelte';
	import WeatherBasicInfo from './WeatherBasicInfo.svelte';
	import InfoCard from '../InfoCard.svelte';
	import type { ComponentProps } from 'svelte';
	import type { WeatherHourly } from 'backend/types';

	export let data: WeatherHourly;

	$: formattedUvi = formatUVI(data.uvi);

	let generalInfoCard: ComponentProps<typeof IconInfo>[];
	$: generalInfoCard = [
		{ icon: 'humidity_high', content: `Szansa na deszcz: ${Math.round(data.pop * 100)}%` },
		{ icon: 'humidity_percentage', content: `Wilgotność: ${data.humidity}%` },
		{ icon: 'compress', content: `Ciśnienie: ${data.pressure} hPa` },
		{
			icon: 'thermometer',
			content: `Odczuwalna temperatura: ${formatTemperature(data.feels_like)}`
		},
		{ icon: 'visibility', content: `Widoczność: ${data.visibility / 1000}km` },
		{ icon: 'cloud', content: `Zachmurzenie: ${data.clouds}%` },
		{ icon: 'water_do', content: `Temp. skraplania rosy: ${formatTemperature(data.dew_point)}` }
	];

	let sunInfoCard: ComponentProps<typeof IconInfo>[];
	$: sunInfoCard = [
		{
			icon: 'wb_sunny',
			content: `Indeks UV: ${formattedUvi.label}`,
			color: formattedUvi.color
		}
	];
</script>

<Container>
	<div class="root">
		<WeatherBasicInfo
			timeFormat="HH:mm"
			temperature={data.temp}
			timestamp={data.dt}
			weather={data.weather[0]} />
		<div class="content">
			<InfoCard header="Ogólne" data={generalInfoCard} />
			<InfoCard header="Słońce" data={sunInfoCard} />
			<WindCard windDirection={data.wind_deg} windSpeed={data.wind_speed} />
		</div>
	</div>
</Container>

<style lang="scss">
	.root {
		display: flex;
		width: 100%;
		flex-direction: column;
		padding-bottom: 3rem;

		.content {
			display: flex;
			gap: 1rem;
			flex-wrap: wrap;
			justify-content: space-around;
		}
	}
</style>
