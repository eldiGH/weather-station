<script lang="ts">
	import MinutelyWeatherTable from '$lib/components/MinutelyWeatherTable.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<MinutelyWeatherTable minutes={data.minutely} />
