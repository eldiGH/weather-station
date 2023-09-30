<script lang="ts">
	import SensorStatusCard from '$lib/components/SensorStatusCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: sensors = data.kioskData.sensors;
</script>

<div class="root">
	{#if sensors.length === 0}
		<div class="header centered">Brak dostępnych czujników</div>
	{:else}
		<div class="sensors">
			{#each sensors as sensor}
				<SensorStatusCard {sensor} />
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	.root {
		padding: 1rem;
	}

	.sensors {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-around;
		flex-wrap: wrap;
		gap: 2rem;
	}

	.header {
		font-size: 2rem;
		margin-bottom: 1.5rem;
	}

	.centered {
		text-align: center;
	}
</style>
