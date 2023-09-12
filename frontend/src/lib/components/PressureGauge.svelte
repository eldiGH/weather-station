<script lang="ts">
	import { roundToPrecision } from '$lib/helpers/math';
	import IconInfo from './IconInfo.svelte';
	import InfoGauge, { type GaugeConfig } from './InfoGauge/InfoGauge.svelte';

	export let value: number;

	const config: GaugeConfig = {
		maxValue: 1063.25,
		minValue: 963.25,
		angle: 270,
		radius: 100,
		width: 15,
		valueDisplayTransform: (value) => `${roundToPrecision(value, 1)} hPa`,
		gap: 1.5,
		barBorderColor: 'black',
		barBorderWidth: 1,
		breakpoints: [
			{ to: 983.25, color: '#ff2424' },
			{ to: 993.25, color: '#fff700' },
			{ to: 1033.25, color: '#0ac947' },
			{ to: 1043.25, color: '#fff700' },
			{ to: 1063.25, color: '#ff2424' }
		],
		valueMarginTop: 5,
		labels: [
			{ value: 963.25, label: '963 hPa' },
			{ value: 983.25, label: '983 hPa' },
			{ value: 993.25, label: '993 hPa' },
			{ value: 1013.25, label: '1013 hPa' },
			{ value: 1033.25, label: '1033 hPa' },
			{ value: 1043.25, label: '1043 hPa' },
			{ value: 1063.25, label: '1063 hPa' }
		]
	};
</script>

<div>
	<InfoGauge {value} {config} />
	<IconInfo weight={200} icon="compress">Ciśnienie</IconInfo>
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
