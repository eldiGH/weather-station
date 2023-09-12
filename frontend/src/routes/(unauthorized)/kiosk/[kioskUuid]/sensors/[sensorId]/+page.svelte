<script lang="ts">
	import HumidityGauge from '$lib/components/HumidityGauge.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import IconInfo from '$lib/components/IconInfo.svelte';
	import Link from '$lib/components/Link.svelte';
	import PressureGauge from '$lib/components/PressureGauge.svelte';
	import ScrollPanel from '$lib/components/ScrollPanel.svelte';
	import TemperatureGauge from '$lib/components/TemperatureGauge.svelte';
	import TopBar from '$lib/components/TopBar.svelte';
	import { formatCreatedAt } from '$lib/helpers/date';
	import type { PageData } from './$types';
	import ChartTabs from '$lib/components/ChartTabs.svelte';

	export let data: PageData;
</script>

{#if data.sensor.currentData}
	<IconInfo class="sensor-timestamp" gap={1} icon="schedule"
		>Ostatnia aktualizacja: {formatCreatedAt(data.sensor.currentData.createdAt)}</IconInfo
	>
	<div class="gauges">
		<TemperatureGauge value={data.sensor.currentData.temperature} />
		<HumidityGauge value={data.sensor.currentData.humidity} />
		<PressureGauge value={data.sensor.currentData.pressure / 100} />
	</div>
{:else}
	Brak danych
{/if}

<style lang="scss">
	:global(.sensor-timestamp) {
		font-size: 2rem;
	}

	.gauges {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		margin: 3rem 0;
	}
</style>
