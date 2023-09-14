<script lang="ts">
	import CurrentWeatherStatus from '$lib/components/CurrentWeatherStatus.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<CurrentWeatherStatus data={data.current} />
