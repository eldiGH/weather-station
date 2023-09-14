<script lang="ts">
	import DailyOrHourlyWeatherTable from '$lib/components/DailyOrHourlyWeatherTable.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="root">
	<DailyOrHourlyWeatherTable daysOrHours={data.daily} />
</div>

<style lang="scss">
	.root {
		padding-bottom: 3rem;
	}
</style>
