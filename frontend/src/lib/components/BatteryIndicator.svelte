<script lang="ts">
	import { toRGB, type Threshold, calculateGradient, toHex } from '$lib/helpers/colors';
	import { minMax, roundToPrecision } from '$lib/helpers/math';
	import { onMount } from 'svelte';
	import IconInfo from './IconInfo.svelte';

	export let batteryReading: number;

	const convertReadingToVoltage = (reading: number) => {
		const conversionFactor = (3.3 / 4096) * 3;

		return roundToPrecision(reading * conversionFactor, 2);
	};

	const gradient: Threshold[] = [
		{ value: 10, color: toRGB('#ff2424') },
		{ value: 50, color: toRGB('#fff700') },
		{ value: 90, color: toRGB('#0ac947') }
	];

	$: voltage = convertReadingToVoltage(batteryReading);
	$: batteryPercentage = minMax(voltage - 3, 0, 1);
	$: color = calculateGradient(batteryPercentage * 100, gradient);

	let totalLength = 0;
	let dasharray = [0, 5000];

	$: {
		if (totalLength > 0) {
			const filledLen = totalLength * batteryPercentage;

			dasharray = [filledLen, totalLength];
		}
	}

	let lineRef: SVGLineElement;

	onMount(() => {
		totalLength = lineRef.getTotalLength();
	});
</script>

<svg width="150" viewBox="0 0 100 50">
	<line
		x1="13"
		y1="25"
		x2="87"
		y2="25"
		stroke-width="25"
		fill="transparent"
		stroke={toHex(color)}
		stroke-dasharray={dasharray.join(' ')}
		bind:this={lineRef} />
	<rect x="10" y="10" width="80" height="30" fill="transparent" stroke="white" rx="5" />
	<rect x="90" y="20" width="5" height="10" fill="transparent" stroke="white" />
	<text text-anchor="middle" transform="translate(0 8)" stroke-width="1" fill="white" x="50" y="25"
		>{voltage}V</text>
</svg>

<style lang="scss">
	text {
		font-weight: 500;
		stroke: rgba(0, 0, 0, 0.4);
	}

	line {
		transition: stroke-dasharray 1.5s ease-in-out;
	}
</style>
