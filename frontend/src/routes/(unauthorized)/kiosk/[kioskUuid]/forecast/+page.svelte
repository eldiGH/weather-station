<script lang="ts">
	import CurrentWeatherCard from '$lib/components/CurrentWeatherCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div>
	<CurrentWeatherCard data={data.current} />
</div>

<style lang="scss">
	div {
		display: flex;
		justify-content: center;
	}
</style>
