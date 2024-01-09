<script lang="ts">
	import { toRGB, type GradientThreshold, getGradient } from '$lib/helpers/colors';
	import IconInfo from './IconInfo.svelte';
	import SvgCircleProgressBar from './SvgCircleProgressBar.svelte';

	export let temperature: number;
	export let humidity: number;

	const minTemperature = -15;
	const idealTemperature = 23;
	const maxTemperature = 40;

	const tempGradient = getGradient([
		{ value: 5, color: '#3b41ff' },
		{ value: 15, color: '#5293fa' },
		{ value: idealTemperature, color: '#0ac947' },
		{ value: 31, color: '#fff700' },
		{ value: 35, color: '#ff7a21' },
		{ value: maxTemperature, color: '#ff2424' }
	]);

	const humGradient = getGradient([
		{ value: 0, color: '#ff2424' },
		{ value: 35, color: '#fff700' },
		{ value: 50, color: '#0ac947' },
		{ value: 65, color: '#fff700' },
		{ value: 100, color: '#ff2424' }
	]);

	const radius = 120;
	const width = 10;

	const tempAngle = -250;
	const tempFromAngle = 215;

	const humAngle = 90;
	const humFromAngle = 225;

	$: svgWidth = radius * 2 + width * 2;
	$: svgHeight = radius * 2 + width * 2;

	$: centerPoint = { x: svgWidth / 2, y: svgHeight / 2 };

	const formatTemperature = (temperature: number) => {
		const integralPart = Math.floor(temperature);

		return {
			integral: integralPart,
			rest: Math.round((temperature - integralPart) * 10)
		};
	};

	const formatHumidity = (humidity: number) => {
		const integralPart = Math.floor(humidity);

		return {
			integral: integralPart,
			rest: Math.round((humidity - integralPart) * 10)
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
			min={minTemperature}
			max={maxTemperature}
			value={temperature}
			gradient={tempGradient}
			{radius}
			{centerPoint}
			{width} />
		<SvgCircleProgressBar
			angle={humAngle}
			fromAngle={humFromAngle}
			min={0}
			max={100}
			value={humidity}
			gradient={humGradient}
			{radius}
			{centerPoint}
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
