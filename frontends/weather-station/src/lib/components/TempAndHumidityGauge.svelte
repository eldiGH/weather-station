<script lang="ts">
	import { MAX_TEMPERATURE, MIN_TEMPERATURE } from '$lib/constants/ambient';
	import { HUM_GRADIENT, TEMP_GRADIENT } from '$lib/constants/gradients';
	import { IconInfo } from '@shared/ui/components';
	import SvgCircleProgressBar from './SvgCircleProgressBar.svelte';

	export let temperature: number;
	export let humidity: number;

	const radius = 120;
	const width = 10;

	const tempAngle = -250;
	const tempFromAngle = 215;

	const humAngle = 90;
	const humFromAngle = 225;

	$: svgWidth = radius * 2 + width * 2;
	$: svgHeight = radius * 2 + width * 2;

	const formatTemperature = (temperature: number) => {
		const roundedTemp = Math.round(temperature * 10) / 10;
		const integralPart = Math.floor(roundedTemp);

		return {
			integral: integralPart,
			rest: Math.round((roundedTemp - integralPart) * 10)
		};
	};

	const formatHumidity = (humidity: number) => {
		const roundedHum = Math.round(humidity * 10) / 10;
		const integralPart = Math.floor(roundedHum);

		return {
			integral: integralPart,
			rest: Math.round((roundedHum - integralPart) * 10)
		};
	};

	$: formattedTemp = formatTemperature(temperature);
	$: formattedHum = formatHumidity(humidity);
</script>

<div class="root">
	<svg width={svgWidth} height={svgHeight}>
		<SvgCircleProgressBar
			angle={tempAngle}
			fromAngle={tempFromAngle}
			min={MIN_TEMPERATURE}
			max={MAX_TEMPERATURE}
			value={temperature}
			gradient={TEMP_GRADIENT}
			{radius}
			{width} />
		<SvgCircleProgressBar
			angle={humAngle}
			fromAngle={humFromAngle}
			min={0}
			max={100}
			value={humidity}
			gradient={HUM_GRADIENT}
			{radius}
			{width} />
	</svg>
	<div class="temperature-text">
		<div class="reading">
			{formattedTemp.integral}<span class="rest">.{formattedTemp.rest}</span>
		</div>
		<div class="label"><IconInfo icon="device_thermostat">Temperatura&nbsp;°C</IconInfo></div>
	</div>
	<div class="humidity-text">
		<div class="label"><IconInfo icon="humidity_high">Wilgotność&nbsp;%</IconInfo></div>
		<div class="reading">
			{formattedHum.integral}<span class="rest">.{formattedHum.rest}</span>
		</div>
	</div>
</div>

<style lang="scss">
	.root {
		position: relative;

		.temperature-text {
			position: absolute;
			left: 50%;
			top: 3rem;
			text-align: center;

			transform: translateX(-50%);

			.reading {
				font-size: 4rem;
				line-height: 2rem;
			}

			.rest {
				font-size: 2rem;
			}

			.label {
				font-size: 1.5rem;
				opacity: 0.7;
			}
		}

		.humidity-text {
			position: absolute;
			left: 50%;
			bottom: 2.5rem;
			text-align: center;

			transform: translateX(-50%);

			.reading {
				font-size: 2.5rem;
				line-height: 2rem;
			}

			.rest {
				font-size: 1.5rem;
			}

			.label {
				font-size: 1.3rem;
				opacity: 0.7;
			}
		}
	}
</style>
