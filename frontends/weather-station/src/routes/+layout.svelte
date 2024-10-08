<script lang="ts">
	import 'chartjs-adapter-date-fns';
	import 'frontend.shared/styles/global.scss';
	import { Chart, registerables } from 'chart.js';
	import { setDefaultOptions } from 'date-fns';
	import { pl } from 'date-fns/locale';
	import ActionPoller from 'frontend.shared/components/ActionPoller';
	import NavigationLoader from 'frontend.shared/components/NavigationLoader';
	import { browser } from '$app/environment';

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
	@use '@theme' as t;

	:root {
		@include t.add-theme('weather-station');
	}
</style>
