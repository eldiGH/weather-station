<script lang="ts">
	import type { Gradient } from '$lib/helpers/colors';
	import { getArcOfCircle } from '$lib/helpers/svg';
	import { minMax } from '@shared/ui/helpers';
	import type { Point } from 'chart.js';
	import { onMount } from 'svelte';

	interface Props {
		min: number;
		max: number;

		value: number;
		fromValue?: number;

		color?: string;
		gradient?: Gradient;

		centerPoint?: Point;
		angle: number;
		fromAngle: number;

		width: number;
		radius: number;
	}

	let {
		min,
		max,
		value,
		fromValue,
		color,
		gradient,
		centerPoint,
		angle,
		fromAngle,
		width,
		radius
	}: Props = $props();

	let backgroundPathRef: SVGPathElement;

	let totalLength = $state(0);
	onMount(() => {
		totalLength = backgroundPathRef.getTotalLength();
	});

	let percentage = $derived((minMax(value, min, max) - min) / (max - min));

	let hasValueFrom = $derived(fromValue !== undefined);
	let percentageFrom = $derived.by(() => {
		if (fromValue !== undefined) {
			return (minMax(fromValue, min, max) - min) / (max - min);
		}

		return 0;
	});

	let dashArray = $derived.by(() => {
		if (totalLength > 0) {
			const dashLength = (hasValueFrom ? percentage - percentageFrom : percentage) * totalLength;
			const gapLength = totalLength - dashLength + 1;

			return [dashLength, gapLength];
		}

		return [0, 99999999];
	});

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

	let cp = $derived.by(() => {
		if (centerPoint) {
			return centerPoint;
		}

		const svgWidth = radius * 2 + width * 2;
		const svgHeight = radius + width * 2;

		return { x: svgWidth / 2, y: svgHeight - width };
	});

	let arc = $derived(getArcOfCircle(cp, radius, fromAngle, angle));
	let circleIndicatorAngle = $derived(
		getRotationAngleOfCircleIndicator(totalLength, percentage, angle)
	);
	let circleIndicatorFromAngle = $derived(
		hasValueFrom ? getRotationAngleOfCircleIndicator(totalLength, percentageFrom, angle) : 0
	);

	let dashoffset = $derived(hasValueFrom ? totalLength * percentageFrom : 0);

	let finalColor = $derived.by(() => {
		if (color) {
			return color;
		} else if (gradient) {
			if (totalLength <= 0) {
				return gradient.getColor(0);
			}

			if (fromValue !== undefined) {
				return gradient.calculate((fromValue + value) / 2);
			}
			return gradient.calculate(value);
		}
		return '#FFFFFF';
	});
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
		stroke-dasharray={`${dashArray.join(' ')}`}
		stroke-dashoffset={-dashoffset} />
	<circle
		style={`transform-origin: ${cp.x}px ${cp.y}px`}
		cx={arc.startPoint.x}
		cy={arc.startPoint.y}
		r={width}
		fill={finalColor}
		stroke="transparent"
		transform={`rotate(${circleIndicatorAngle})`}
		class="indicator__ball" />
	{#if hasValueFrom}
		<circle
			style={`transform-origin: ${cp.x}px ${cp.y}px`}
			cx={arc.startPoint.x}
			cy={arc.startPoint.y}
			r={width}
			fill={finalColor}
			stroke="transparent"
			transform={`rotate(${circleIndicatorFromAngle})`}
			class="indicator__ball" />
	{/if}
</g>

<style lang="scss">
	$animationTime: 1.5s;
	$animationTimingFunc: ease-in-out;

	.indicator {
		filter: drop-shadow(1px 1px 1px 1px rgb(0 0 0 / 0.4));

		transition-duration: $animationTime;
		transition-timing-function: $animationTimingFunc;
		transition-property: stroke, stroke-dasharray, stroke-dashoffset;

		&__background {
			filter: drop-shadow(1px 1px 1px 1px rgb(0 0 0 / 0.4));

			opacity: 0.3;

			transition: stroke $animationTime $animationTimingFunc;
		}

		&__ball {
			transition-duration: $animationTime;
			transition-timing-function: $animationTimingFunc;
			transition-property: transform, fill;
		}
	}
</style>
