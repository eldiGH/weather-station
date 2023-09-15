<script lang="ts">
	import MinutelyWeatherTable from '$lib/components/Weather/MinutelyWeatherTable.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="root">
	{#if data.minutely}
		<MinutelyWeatherTable minutes={data.minutely} />
	{:else}
		<div>Brak danych o opadach</div>
	{/if}
</div>

<style lang="scss">
	.root {
		padding-top: 2rem;

		div {
			text-align: center;
			font-size: 2rem;
		}
	}
</style>
