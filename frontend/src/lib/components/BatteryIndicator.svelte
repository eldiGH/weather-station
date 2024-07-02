<script lang="ts">
	import { getGradient } from '$lib/helpers/colors';
	import { minMax, roundToPrecision } from '$lib/helpers/math';
	import { onMount } from 'svelte';
	import { v4 } from 'uuid';

	export let batteryReading: number;

	const clipId = `clip-${v4()}`;

	const convertReadingToVoltage = (reading: number) => {
		const conversionFactor = (3.3 / 4096) * 3;

		return roundToPrecision(reading * conversionFactor, 2);
	};

	const gradient = getGradient([
		{ value: 10, color: '#ff2424' },
		{ value: 50, color: '#fff700' },
		{ value: 90, color: '#0ac947' }
	]);

	let mounted = false;
	let batteryPercentage = 0;

	$: voltage = convertReadingToVoltage(batteryReading);
	let color: string;

	$: {
		if (mounted) {
			color = gradient.calculate(batteryPercentage * 100);
		} else {
			color = gradient.getColor(0);
		}
	}

	onMount(() => {
		mounted = true;
	});

	$: {
		if (mounted) {
			batteryPercentage = minMax(voltage - 3, 0, 1);
		}
	}
</script>

<svg width="150" viewBox="0 0 100 50">
	<defs>
		<clipPath id={clipId}>
			<rect
				class="clip-rect"
				transform={`scale(${batteryPercentage}, 1)`}
				x="10"
				y="10"
				width="80"
				height="30"
				rx="5" />
		</clipPath>
	</defs>

	<rect
		x="10"
		y="10"
		width="80"
		height="30"
		fill={color}
		stroke="transparent"
		class="filling"
		rx="5"
		clip-path={`url(#${clipId})`} />
	<rect x="10" y="10" width="80" height="30" fill="transparent" stroke="white" rx="5" />
	<rect x="90" y="20" width="5" height="10" fill="transparent" stroke="white" />
	<text text-anchor="middle" transform="translate(0 8)" stroke-width="1" fill="white" x="50" y="25"
		>{voltage}V</text>
</svg>

<style lang="scss">
	$animationTime: 1.5s;
	$animationTimingFunc: ease-in-out;

	text {
		font-weight: 500;
		stroke: rgba(0, 0, 0, 0.4);
	}

	.clip-rect {
		transition: transform $animationTime $animationTimingFunc;
		transform-origin: 9.99px 25px;
	}

	.filling {
		transition: fill $animationTime $animationTimingFunc;
	}
</style>
