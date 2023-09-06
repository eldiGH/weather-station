<script lang="ts">
	import LineChart from '$lib/components/LineChart.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="root">
	{#if data.lastSensorEntry}
		<div>
			<div>Temperatura: {data.lastSensorEntry.temperature} °C</div>
			<div>Wilgotność: {data.lastSensorEntry.humidity}%</div>
			<div>Ciśnienie: {data.lastSensorEntry.pressure} hPa</div>
			<div>Oporność gazów: {data.lastSensorEntry.gasResistance} Ohms</div>
			<div>Ostatnie dane z: {data.lastSensorEntry.createdAt}</div>
		</div>
	{/if}

	<LineChart config={data.config} />
</div>

<style lang="scss">
	.root {
		width: 100%;
	}
</style>
