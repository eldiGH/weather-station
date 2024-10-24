<script lang="ts" context="module">
	export interface GaugeBreakpoint {
		to: number;
		color: string;
	}

	export interface GaugeConfig {
		minValue: number;
		maxValue: number;
		angle: number;
		radius: number;
		width: number;
		breakpoints: GaugeBreakpoint[];
		barBorderColor?: string;
		barBorderWidth?: number;
		needleColor?: string;
		valueDisplayTransform?: (value: number) => string;
		showValue?: boolean;
		gap?: number;
		labels?: { value: number; label?: string }[];
		valueMarginTop?: number;
	}
</script>

<script lang="ts">
	import { onMount, type ComponentProps } from 'svelte';

	import GaugeNeedle from './GaugeNeedle.svelte';
	import GaugeLabel from './GaugeLabel.svelte';
	import GaugeValue from './GaugeValue.svelte';
	import GaugeBar from './GaugeBar.svelte';
	import { roundToPrecision, getRadians } from '@shared/ui/helpers';

	export let config: GaugeConfig;
	export let value: number;

	const getAngleForValue = (
		value: number,
		gaugeAngle: number,
		normalizationValue: number,
		normalizedMax: number,
		startAngle: number
	): number => {
		const normalizedValue = value + normalizationValue;

		return startAngle - (normalizedValue / normalizedMax) * gaugeAngle;
	};

	const getGauges = (
		config: GaugeConfig,
		center: { x: number; y: number },
		normalizationValue: number,
		normalizedMax: number,
		startAngle: number
	): ComponentProps<GaugeBar>[] => {
		const getGauge = (
			breakpoint: GaugeBreakpoint,
			index: number,
			breakpoints: GaugeBreakpoint[]
		): ComponentProps<GaugeBar> => {
			const to = breakpoint.to ?? config.maxValue;
			const { color } = breakpoint;

			let from: number;
			let fromGap = 0;
			let toGap = 0;

			if (index === 0) {
				from = config.minValue;
			} else {
				from = breakpoints[index - 1].to;
			}

			if (index === 0) {
				toGap = config.gap ?? 0;
			} else if (index === breakpoints.length - 1) {
				fromGap = config.gap ?? 0;
			} else {
				toGap = config.gap ?? 0;
				fromGap = config.gap ?? 0;
			}

			const fromAngle =
				getAngleForValue(from, config.angle, normalizationValue, normalizedMax, startAngle) -
				fromGap;
			const toAngle =
				getAngleForValue(to, config.angle, normalizationValue, normalizedMax, startAngle) + toGap;

			return {
				fromAngle,
				width: config.width,
				arcAngle: -(fromAngle - toAngle),
				radius: config.radius,
				fill: color,
				x: center.x,
				y: center.y
			};
		};

		return config.breakpoints.map(getGauge);
	};

	const getLabels = (
		config: GaugeConfig,
		center: { x: number; y: number },
		normalizationValue: number,
		normalizedMax: number,
		startAngle: number
	): ComponentProps<GaugeLabel>[] => {
		return (
			config.labels?.map(({ label, value }) => {
				const angle = getAngleForValue(
					value,
					config.angle,
					normalizationValue,
					normalizedMax,
					startAngle
				);

				return {
					label: label ?? value.toString(),
					angle,
					x: center.x,
					y: center.y,
					radius: config.radius
				};
			}) ?? []
		);
	};

	const getLabelsAdditionalWidth = (config: GaugeConfig): number => {
		if (!config.labels || config.labels.length === 0) return 0;

		const lastLabel = config.labels.at(-1)?.label ?? '';

		return 17 + 9 * lastLabel.length;
	};

	let delayedValue = config.minValue;

	$: labelsAdditionalWidth = getLabelsAdditionalWidth(config);
	$: labelsAdditionalHeight = config.labels?.length ? 30 : 0;
	$: width = config.radius * 2 + 2 * labelsAdditionalWidth;
	$: height =
		config.radius -
		roundToPrecision(config.radius * Math.sin(getRadians(startAngle)), 5) +
		labelsAdditionalHeight * 2;
	$: center = {
		x: config.radius + labelsAdditionalWidth,
		y: config.radius + labelsAdditionalHeight
	};
	$: normalizationValue = -config.minValue;
	$: normalizedMax =
		(config.maxValue >= 0 ? config.maxValue : Math.abs(config.maxValue)) + normalizationValue;
	$: startAngle = config.angle / 2 + 90;
	$: gauges = getGauges(config, center, normalizationValue, normalizedMax, startAngle);
	$: labels = getLabels(config, center, normalizationValue, normalizedMax, startAngle);

	$: needleAngle =
		startAngle - ((delayedValue + normalizationValue) / normalizedMax) * config.angle;

	let mounted = false;
	onMount(() => {
		mounted = true;
	});

	$: {
		if (mounted) {
			delayedValue = value;
		}
	}
</script>

<div class="container">
	<svg {width} {height}>
		{#each gauges as gauge}
			<GaugeBar stroke={config.barBorderColor} strokeWidth={config.barBorderWidth} {...gauge} />
		{/each}
		{#each labels as label}
			<GaugeLabel {...label} />
		{/each}
		<GaugeNeedle
			x={center.x}
			y={center.y}
			length={config.radius}
			width={config.radius / 5}
			fill={config.needleColor}
			rotation={needleAngle}
			stroke="black"
			strokeWidth={1} />
		{#if config.showValue !== false}
			<GaugeValue
				x={center.x}
				y={center.y}
				value={config.valueDisplayTransform?.(value) ?? value.toString()} />
		{/if}
	</svg>
</div>

<style lang="scss">
	.container {
		display: inline-flex;
		position: relative;
	}
</style>
