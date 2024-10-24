<script lang="ts">
	import 'chartjs-adapter-date-fns';
	import '@shared/ui/styles/global.scss';
	import { Chart, registerables } from 'chart.js';
	import { setDefaultOptions } from 'date-fns';
	import { pl } from 'date-fns/locale';
	import { browser } from '$app/environment';
	import ActionPoller from '$lib/components/ActionPoller.svelte';
	import { NavigationLoader } from '@shared/ui/components';

	Chart.defaults.borderColor = '#545454';
	Chart.defaults.color = '#FFFFFF';

	Chart.register(...registerables);

	setDefaultOptions({ locale: pl });
</script>

{#if browser}
	<NavigationLoader />
{/if}

<ActionPoller />
<slot />

<style lang="scss">
	@use '@shared/ui/styles/theme' as t;

	:root {
		@include t.add-theme('weather-station');
	}
</style>
