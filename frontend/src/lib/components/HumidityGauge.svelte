<script lang="ts">
	import { roundToPrecision } from '$lib/helpers/math';
	import IconInfo from './IconInfo.svelte';
	import InfoGauge, { type GaugeConfig } from './InfoGauge/InfoGauge.svelte';

	export let value: number;

	const config: GaugeConfig = {
		maxValue: 100,
		minValue: 0,
		angle: 270,
		radius: 100,
		width: 15,
		valueDisplayTransform: (value) => `${roundToPrecision(value, 1)}%`,
		gap: 1.5,
		barBorderColor: 'black',
		barBorderWidth: 1,
		breakpoints: [
			{ to: 30, color: '#ff2424' },
			{ to: 40, color: '#fff700' },
			{ to: 60, color: '#0ac947' },
			{ to: 70, color: '#fff700' },
			{ to: 100, color: '#ff2424' }
		],
		valueMarginTop: 5,
		labels: [
			{ value: 0, label: '0%' },
			{ value: 30, label: '30%' },
			{ value: 40, label: '40%' },
			{ value: 50, label: '50%' },
			{ value: 60, label: '60%' },
			{ value: 70, label: '70%' },
			{ value: 100, label: '100%' }
		]
	};
</script>

<div>
	<InfoGauge {value} {config} />
	<IconInfo weight={200} icon="humidity_percentage">Wilgotność</IconInfo>
</div>

<style lang="scss">
	div {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		font-size: 2rem;
	}
</style>
