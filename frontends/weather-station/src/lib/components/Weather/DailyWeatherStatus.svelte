<script lang="ts">
	import { formatTemperature, formatUVI, formatUnixTimestamp } from '$lib/helpers/formatters';
	import type IconInfo from '../IconInfo.svelte';
	import Container from '../Container.svelte';
	import WindCard from './WindCard.svelte';
	import WeatherBasicInfo from './WeatherBasicInfo.svelte';
	import InfoCard from '../InfoCard.svelte';
	import type { ComponentProps } from 'svelte';
	import type { WeatherDaily } from 'backend/types';

	export let data: WeatherDaily;

	$: formattedUvi = formatUVI(data.uvi);

	let generalInfoCard: ComponentProps<IconInfo>[];
	$: generalInfoCard = [
		{ icon: 'thermometer', content: `Temperatura max: ${formatTemperature(data.temp.max)}` },
		{ icon: 'thermometer', content: `Temperatura min: ${formatTemperature(data.temp.min)}` },
		{ icon: 'humidity_high', content: `Szansa na deszcz: ${Math.round(data.pop * 100)}%` },
		{ icon: 'humidity_percentage', content: `Wilgotność: ${data.humidity}%` },
		{ icon: 'compress', content: `Ciśnienie: ${data.pressure} hPa` },
		{ icon: 'visibility', content: `Widoczność: ${data.visibility / 1000}km` },
		{ icon: 'cloud', content: `Zachmurzenie: ${data.clouds}%` },
		{ icon: 'water_do', content: `Temp. skraplania rosy: ${formatTemperature(data.dew_point)}` }
	];

	let morningInfoCard: ComponentProps<IconInfo>[];
	$: morningInfoCard = [
		{ icon: 'thermometer', content: `Temperatura: ${formatTemperature(data.temp.morn)}` },
		{ icon: 'thermometer', content: `Odczuwalna: ${formatTemperature(data.feels_like.morn)}` }
	];

	let dayInfoCard: ComponentProps<IconInfo>[];
	$: dayInfoCard = [
		{ icon: 'thermometer', content: `Temperatura: ${formatTemperature(data.temp.day)}` },
		{ icon: 'thermometer', content: `Odczuwalna: ${formatTemperature(data.feels_like.day)}` }
	];

	let eveningInfoCard: ComponentProps<IconInfo>[];
	$: eveningInfoCard = [
		{ icon: 'thermometer', content: `Temperatura: ${formatTemperature(data.temp.eve)}` },
		{ icon: 'thermometer', content: `Odczuwalna: ${formatTemperature(data.feels_like.eve)}` }
	];

	let nightInfoCard: ComponentProps<IconInfo>[];
	$: nightInfoCard = [
		{ icon: 'thermometer', content: `Temperatura: ${formatTemperature(data.temp.night)}` },
		{ icon: 'thermometer', content: `Odczuwalna: ${formatTemperature(data.feels_like.night)}` }
	];

	let sunInfoCard: ComponentProps<IconInfo>[];
	$: sunInfoCard = [
		{ icon: 'wb_twilight', content: `Wschód słońca: ${formatUnixTimestamp(data.sunrise)}` },
		{ icon: 'wb_twilight', content: `Zachód słońca: ${formatUnixTimestamp(data.sunset)}` },
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
			timeFormat="EEEE dd.MM"
			timeIcon="calendar_month"
			temperature={data.temp.max}
			timestamp={data.dt}
			weather={data.weather[0]} />
		<div class="content">
			<InfoCard header="Ogólne" data={generalInfoCard} />
			<InfoCard header="Rano" data={morningInfoCard} />
			<InfoCard header="Południe" data={dayInfoCard} />
			<InfoCard header="Wieczór" data={eveningInfoCard} />
			<InfoCard header="Noc" data={nightInfoCard} />
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
