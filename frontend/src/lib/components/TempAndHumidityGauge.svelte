<script lang="ts">
	import { calculateGradient, toRGB, type Threshold, toHex } from '$lib/helpers/colors';
	import { getArcOfCircle } from '$lib/helpers/svg';
	import type { GetLatestBME68XDataEntryResponse } from 'shared';
	import { onMount } from 'svelte';
	import IconInfo from './IconInfo.svelte';

	export let temperature: number;
	export let humidity: number;

	let normalizedTemperature: number;
	$: {
		if (temperature > maxTemperature) {
			normalizedTemperature = maxTemperature;
		} else if (temperature < minTemperature) {
			normalizedTemperature = minTemperature;
		} else {
			normalizedTemperature = temperature;
		}
	}

	const minTemperature = -15;
	const idealTemperature = 23;
	const maxTemperature = 40;

	const tempGradientThreshold: Threshold[] = [
		{ value: 15, color: toRGB('#3b41ff') },
		{ value: 15, color: toRGB('#5293fa') },
		{ value: idealTemperature, color: toRGB('#0ac947') },
		{ value: 31, color: toRGB('#fff700') },
		{ value: 35, color: toRGB('#ff7a21') },
		{ value: maxTemperature, color: toRGB('#ff2424') }
	];

	const humGradientThreshold: Threshold[] = [
		{ value: 0, color: toRGB('#ff2424') },
		{ value: 35, color: toRGB('#fff700') },
		{ value: 50, color: toRGB('#0ac947') },
		{ value: 65, color: toRGB('#fff700') },
		{ value: 100, color: toRGB('#ff2424') }
	];

	const radius = 120;
	const width = 10;
	const tempAngle = 250;
	const humAngle = 90;

	$: svgWidth = radius * 2 + width * 2;
	$: svgHeight = radius * 2 + width * 2;

	$: centerPoint = { x: svgWidth / 2, y: svgHeight / 2 };

	$: tempFromAngle = tempAngle / 2 + 90;
	$: humFromAngle = 270 - humAngle / 2;

	$: tempArcPath = getArcOfCircle(centerPoint, radius, tempFromAngle, -tempAngle);
	$: humArcPath = getArcOfCircle(centerPoint, radius, humFromAngle, humAngle);

	$: tempColor = toHex(calculateGradient(normalizedTemperature, tempGradientThreshold));
	$: humColor = toHex(calculateGradient(humidity, humGradientThreshold));

	let tempPath: SVGPathElement;
	let humPath: SVGPathElement;

	let tempPathTotalLen: number = 0;
	let humPathTotalLen: number = 0;

	let temperaturePercentage: number;
	$: {
		const normalizedMax = maxTemperature - minTemperature;
		const normalizedValue = normalizedTemperature - minTemperature;

		temperaturePercentage = normalizedValue / normalizedMax;

		if (temperaturePercentage > 1) {
			temperaturePercentage = 1;
		} else if (temperaturePercentage < 0) {
			temperaturePercentage = 0;
		}
	}

	let tempDasharray: [number, number];
	$: {
		if (tempPathTotalLen === 0) {
			tempDasharray = [0, 5000];
		} else {
			const dashLength = temperaturePercentage * tempPathTotalLen;
			const gapLength = tempPathTotalLen - dashLength + 1;

			tempDasharray = [dashLength, gapLength];
		}
	}

	$: humPercentage = humidity / 100;
	let humDasharray: [number, number];
	$: {
		if (tempPathTotalLen === 0) {
			humDasharray = [0, 5000];
		} else {
			const dashLength = humPercentage * humPathTotalLen;
			const gapLength = humPathTotalLen - dashLength + 1;

			humDasharray = [dashLength, gapLength];
		}
	}

	let formattedTemp: { integral: number; rest: number };
	$: {
		const integralPart = Math.floor(temperature);

		formattedTemp = {
			integral: integralPart,
			rest: Math.floor((temperature - integralPart) * 10)
		};
	}

	let formattedHum: { integral: number; rest: number };
	$: {
		const integralPart = Math.floor(humidity);

		formattedHum = {
			integral: integralPart,
			rest: Math.floor((humidity - integralPart) * 10)
		};
	}

	let mounted = false;

	$: tempCircleAngle = mounted ? temperaturePercentage * tempAngle : 0;
	$: humCircleAngle = mounted ? humPercentage * humAngle : 0;

	onMount(() => {
		tempPathTotalLen = tempPath.getTotalLength();
		humPathTotalLen = humPath.getTotalLength();

		mounted = true;
	});
</script>

<div class="root">
	<svg width={svgWidth} height={svgHeight}>
		<g>
			<path
				d={`M ${tempArcPath.startPoint.x} ${tempArcPath.startPoint.y} ${tempArcPath.path}`}
				stroke-width={width}
				stroke={tempColor}
				fill="transparent"
				class="indicator__background"
				stroke-linecap="round" />
			<path
				bind:this={tempPath}
				d={`M ${tempArcPath.startPoint.x} ${tempArcPath.startPoint.y} ${tempArcPath.path}`}
				stroke-width={width}
				stroke={tempColor}
				fill="transparent"
				stroke-linecap="round"
				class="indicator"
				stroke-dasharray={`${tempDasharray.join(' ')}`} />
			<circle
				cx={tempArcPath.startPoint.x}
				cy={tempArcPath.startPoint.y}
				r={width}
				fill={tempColor}
				stroke="transparent"
				transform={`rotate(${tempCircleAngle})`} />
		</g>
		<g>
			<path
				d={`M ${humArcPath.startPoint.x} ${humArcPath.startPoint.y} ${humArcPath.path}`}
				stroke-width={width}
				stroke={humColor}
				fill="transparent"
				class="indicator__background"
				stroke-linecap="round" />
			<path
				bind:this={humPath}
				d={`M ${humArcPath.startPoint.x} ${humArcPath.startPoint.y} ${humArcPath.path}`}
				stroke-width={width}
				stroke={humColor}
				fill="transparent"
				stroke-linecap="round"
				class="indicator"
				stroke-dasharray={`${humDasharray.join(' ')}`} />
			<circle
				cx={humArcPath.startPoint.x}
				cy={humArcPath.startPoint.y}
				r={width}
				fill={humColor}
				stroke="transparent"
				transform={`rotate(${-humCircleAngle})`} />
		</g>
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

	$animationTime: 1.5s;
	$animationTimingFunc: ease-in-out;

	.indicator {
		filter: drop-shadow(1px 1px 1px 1px rgb(0 0 0 / 0.4));

		transition-duration: $animationTime;
		transition-timing-function: $animationTimingFunc;
		transition-property: stroke, stroke-dasharray;

		&__background {
			filter: drop-shadow(1px 1px 1px 1px rgb(0 0 0 / 0.4));

			opacity: 0.3;

			transition: stroke $animationTime $animationTimingFunc;
		}
	}

	circle {
		transform-origin: 50% 50%;
		transition: transform $animationTime $animationTimingFunc;
	}
</style>
