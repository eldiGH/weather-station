<script lang="ts">
	import { roundToPrecision } from '../helpers/math';
	import { onMount } from 'svelte';

	export let size = 40;
	export let thickness = roundToPrecision(size / 11.111, 3);
	$: radius = roundToPrecision((size - thickness) / 2, 3);

	let circle: SVGCircleElement;

	let totalPathLen = 0;

	onMount(() => {
		totalPathLen = roundToPrecision(circle.getTotalLength(), 3);
	});
</script>

<span style="--size: {size}px; --total-path-len: {totalPathLen}px">
	<svg viewBox="{size / 2} {size / 2} {size} {size}">
		<circle
			bind:this={circle}
			cx={size}
			cy={size}
			r={radius}
			fill="none"
			stroke-width={thickness}
			stroke="#fff" />
	</svg>
</span>

<style lang="scss">
	span {
		width: var(--size);
		height: var(--size);

		display: inline-block;

		animation: rotate 1.2s linear infinite;
		circle {
			stroke-dasharray: calc(var(--total-path-len) * 0.7), var(--total-path-len);
			stroke-dashoffset: calc(-1 * ((var(--total-path-len) * 0.1) + var(--total-path-len)));

			animation: stroke-len 1.4s ease-in-out infinite;
		}
	}

	@keyframes stroke-len {
		0% {
			stroke-dasharray: 1px, var(--total-path-len);
			stroke-dashoffset: 0;
		}

		50% {
			stroke-dasharray: calc(var(--total-path-len) * 0.85), var(--total-path-len);
			stroke-dashoffset: calc(-1 * (var(--total-path-len) * 0.15));
		}

		100% {
			stroke-dasharray: calc(var(--total-path-len) * 0.85), var(--total-path-len);
			stroke-dashoffset: calc(-1 * var(--total-path-len));
		}
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}
</style>
