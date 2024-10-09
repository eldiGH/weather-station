<script lang="ts">
	import { getRadians, roundToPrecision } from '@shared/helpers/math';

	export let label: string;
	export let radius: number;
	export let x: number;
	export let y: number;
	export let angle: number;

	$: radians = getRadians(-angle);
	$: rectX = roundToPrecision((radius + 5) * Math.cos(radians), 5) + x;
	$: rectY = roundToPrecision((radius + 5) * Math.sin(radians), 5) + y;

	$: textX = roundToPrecision((radius + 17) * Math.cos(radians), 5) + x;
	$: textY = roundToPrecision((radius + 17) * Math.sin(radians), 5) + y;

	$: textTransform = `translate(0, ${
		Math.abs(angle - 90) > 45 ? Math.abs(Math.sin(getRadians(angle - 90))) * 5 : 0
	})`;

	const getTextAnchor = (angle: number) => {
		if (angle > 45 && angle < 125) {
			return 'middle';
		} else if (angle >= 125 && angle <= 225) {
			return 'end';
		} else {
			return 'start';
		}
	};
</script>

<g transform={`translate(${rectX}, ${rectY})`}>
	<text transform={`rotate(${-angle})`} font-size="1rem" fill="white">_</text>
</g>
<g transform={`translate(${textX}, ${textY})`}>
	<text
		class="label"
		transform={textTransform}
		text-anchor={getTextAnchor(angle)}
		font-size="0.8rem"
		fill="white">{label}</text>
</g>

<style lang="scss">
	.label {
		text-shadow:
			-1px -1px 0 #000,
			1px -1px 0 #000,
			-1px 1px 0 #000,
			1px 1px 0 #000;
	}
</style>
