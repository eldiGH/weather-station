<script lang="ts">
	import { roundToPrecision } from '@shared/ui/helpers';
	import InfoGauge, { type GaugeConfig } from './InfoGauge/InfoGauge.svelte';
	import { IconInfo } from '@shared/ui/components';

	export let value: number;

	const config: GaugeConfig = {
		maxValue: 40,
		minValue: 0,
		angle: 270,
		radius: 100,
		width: 15,
		valueDisplayTransform: (value) => `${roundToPrecision(value, 1)}°C`,
		gap: 1.5,
		barBorderColor: 'black',
		barBorderWidth: 1,
		breakpoints: [
			{ to: 8, color: '#0007d1' },
			{ to: 15, color: '#3b41ff' },
			{ to: 21, color: '#0f9ff2' },
			{ to: 26, color: '#0ac947' },
			{ to: 31, color: '#fff700' },
			{ to: 35, color: '#ff7a21' },
			{ to: 40, color: '#ff2424' }
		],
		valueMarginTop: 5,
		labels: [
			{ value: 0, label: '0°C' },
			{ value: 8, label: '8°C' },
			{ value: 15, label: '15°C' },
			{ value: 21, label: '21°C' },
			{ value: 26, label: '26°C' },
			{ value: 31, label: '31°C' },
			{ value: 35, label: '35°C' },
			{ value: 40, label: '40°C' }
		]
	};
</script>

<div>
	<InfoGauge {value} {config} />
	<IconInfo weight={200} icon="device_thermostat">Temperatura</IconInfo>
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
