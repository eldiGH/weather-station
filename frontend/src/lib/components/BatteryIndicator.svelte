<script lang="ts">
	import { roundToPrecision } from '$lib/helpers/math';
	import IconInfo from './IconInfo.svelte';

	export let batteryPercentage: number;

	const convertReadingToVoltage = (reading: number) => {
		const conversionFactor = (3.3 / 4096) * 3;

		return roundToPrecision(reading * conversionFactor, 2);
	};
</script>

<IconInfo icon="battery_full">
	{convertReadingToVoltage(batteryPercentage)}V
</IconInfo>
