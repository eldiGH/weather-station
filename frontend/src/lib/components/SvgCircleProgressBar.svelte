<script lang="ts">
	import type { Gradient } from '$lib/helpers/colors';
	import { minMax } from '$lib/helpers/math';
	import { getArcOfCircle } from '$lib/helpers/svg';
	import type { Point } from 'chart.js';
	import { onMount } from 'svelte';

	export let min: number;
	export let max: number;
	export let value: number;

	export let color: string | undefined = undefined;
	export let gradient: Gradient | undefined = undefined;

	export let centerPoint: Point;
	export let angle: number;
	export let fromAngle: number;

	export let width: number;
	export let radius: number;

	let backgroundPathRef: SVGPathElement;

	let totalLength = 0;
	onMount(() => {
		totalLength = backgroundPathRef.getTotalLength();
	});

	$: percentage = (minMax(value, min, max) - min) / (max - min);
	let dashArray = [0, 99999999];

	$: {
		if (totalLength > 0) {
			const dashLength = percentage * totalLength;
			const gapLength = totalLength - dashLength + 1;

			dashArray = [dashLength, gapLength];
		}
	}

	const getRotationAngleOfCircleIndicator = (
		totalLength: number,
		percentage: number,
		angle: number
	) => {
		if (totalLength <= 0) {
			return 0;
		}

		const rotationAngle = percentage * angle;

		return -rotationAngle;
	};

	$: arc = getArcOfCircle(centerPoint, radius, fromAngle, angle);
	$: circleIndicatorAngle = getRotationAngleOfCircleIndicator(totalLength, percentage, angle);

	let finalColor: string;

	$: {
		if (color) {
			finalColor = color;
		} else if (gradient) {
			if (totalLength <= 0) {
				finalColor = gradient.getColor(0);
			} else {
				finalColor = gradient.calculate(value);
			}
		} else {
			finalColor = '#FFFFFF';
		}
	}
</script>

<g>
	<path
		d={`M ${arc.startPoint.x} ${arc.startPoint.y} ${arc.path}`}
		stroke-width={width}
		stroke={finalColor}
		fill="transparent"
		class="indicator__background"
		stroke-linecap="round" />
	<path
		bind:this={backgroundPathRef}
		d={`M ${arc.startPoint.x} ${arc.startPoint.y} ${arc.path}`}
		stroke-width={width}
		stroke={finalColor}
		fill="transparent"
		stroke-linecap="round"
		class="indicator"
		stroke-dasharray={`${dashArray.join(' ')}`} />
	<circle
		cx={arc.startPoint.x}
		cy={arc.startPoint.y}
		r={width}
		fill={finalColor}
		stroke="transparent"
		transform={`rotate(${circleIndicatorAngle})`}
		class="indicator__ball" />
</g>

<style lang="scss">
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

		&__ball {
			transform-origin: 50% 50%;
			transition-duration: $animationTime;
			transition-timing-function: $animationTimingFunc;
			transition-property: transform, fill;
		}
	}
</style>
