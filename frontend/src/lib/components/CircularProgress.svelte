<script lang="ts">
	import type { Gradient } from '$lib/helpers/colors';
	import SvgCircleProgressBar from './SvgCircleProgressBar.svelte';

	interface Props {
		min: number;
		max: number;

		value: number;
		fromValue?: number;

		angle?: number;
		fromAngle?: number;

		width?: number;
		radius?: number;

		color?: string;
		gradient?: Gradient;
	}

	let {
		fromValue,
		value,
		max,
		min,
		angle = -180,
		fromAngle = 180,
		width = 10,
		radius = 120,
		color,
		gradient
	}: Props = $props();

	let svgWidth = $derived(radius * 2 + width * 2);
</script>

<svg width={svgWidth}>
	<SvgCircleProgressBar
		{fromValue}
		{value}
		{max}
		{min}
		{angle}
		{fromAngle}
		{width}
		{radius}
		{color}
		{gradient} />
</svg>
