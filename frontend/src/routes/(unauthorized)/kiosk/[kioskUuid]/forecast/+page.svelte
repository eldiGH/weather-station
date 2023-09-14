<script lang="ts">
	import CurrentWeatherCard from '$lib/components/CurrentWeatherCard.svelte';
	import { invalidateDataWatcherFactory } from '$lib/helpers/data';
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const invalidateDataWatcher = invalidateDataWatcherFactory('api:kioskForecast');

	onMount(() => {
		invalidateDataWatcher.onMount();
	});

	onDestroy(() => {
		invalidateDataWatcher.onDestroy();
	});

	$: {
		invalidateDataWatcher.onDateUpdate(data.nextRefreshTimestamp);
	}
</script>

<div>
	<CurrentWeatherCard data={data.current} />
</div>

<style lang="scss">
	div {
		display: flex;
		justify-content: center;
		padding-bottom: 3rem;
	}
</style>
