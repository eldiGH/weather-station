<script lang="ts">
	import { getGradient } from '$lib/helpers/colors';
	import { IconInfo } from '@shared/ui/components';
	import SvgCircleProgressBar from './SvgCircleProgressBar.svelte';

	export let pressure: number;

	const max = 1063.25;
	const min = 963.25;

	const fromAngle = 180;
	const angle = -180;
	const radius = 120;
	const width = 10;

	const gradient = getGradient([
		{ value: 983.25, color: '#ff2424' },
		{ value: 993.25, color: '#fff700' },
		{ value: 1033.25, color: '#0ac947' },
		{ value: 1043.25, color: '#fff700' },
		{ value: 1063.25, color: '#ff2424' }
	]);

	const svgWidth = radius * 2 + width * 2;
	const svgHeight = radius + width * 2;

	const centerPoint = { x: svgWidth / 2, y: svgHeight - width };

	const formatPressure = (pressure: number) => {
		const roundedPres = Math.round(pressure * 10) / 10;
		const integralPart = Math.floor(roundedPres);

		return {
			integral: integralPart,
			rest: Math.round((roundedPres - integralPart) * 10)
		};
	};

	$: formattedPressure = formatPressure(pressure);
</script>

<div class="root">
	<svg width={svgWidth} height={svgHeight}>
		<SvgCircleProgressBar
			{angle}
			{fromAngle}
			{centerPoint}
			{max}
			{min}
			{radius}
			{width}
			{gradient}
			value={pressure} />
	</svg>
	<div class="pressure__container">
		<div class="pressure">
			{formattedPressure.integral}<span class="pressure__rest">.{formattedPressure.rest}</span>
		</div>
		<div class="pressure__description"><IconInfo icon="compress">Ciśnienie&nbsp;hPa</IconInfo></div>
	</div>
</div>

<style lang="scss">
	.root {
		position: relative;
		width: 100%;

		.pressure {
			font-size: 3rem;
			line-height: 2rem;

			&__container {
				position: absolute;
				bottom: 20px;
				left: 50%;

				transform: translateX(-50%);
				text-align: center;
			}

			&__description {
				font-size: 1.5rem;
				opacity: 0.7;
			}

			&__rest {
				font-size: 2rem;
			}
		}
	}
</style>
