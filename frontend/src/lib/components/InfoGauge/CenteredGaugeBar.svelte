<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import GaugeBar from './GaugeBar.svelte';
	import { getRadians, roundToPrecision } from '$lib/helpers/math';

	type $$Props = ComponentProps<GaugeBar>;

	$: restProps = $$restProps as ComponentProps<GaugeBar>;

	export let x: number;
	export let y: number;
	export let radius: number;
	export let fromAngle: number;

	$: angle = fromAngle + (fromAngle <= 180 ? 180 : -180);
	$: radians = getRadians(angle);
	$: calculatedX = x - roundToPrecision(radius * Math.cos(radians), 5);
	$: calculatedY = y + roundToPrecision(radius * Math.sin(radians), 5);
</script>

<GaugeBar {...restProps} {radius} {fromAngle} x={calculatedX} y={calculatedY} />
