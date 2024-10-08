<script lang="ts">
	import CurrentWeatherStatus from '$lib/components/Weather/CurrentWeatherStatus.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div>
	<CurrentWeatherStatus data={data.current} />
</div>

<style lang="scss">
	div {
		padding-top: 3rem;
	}
</style>
