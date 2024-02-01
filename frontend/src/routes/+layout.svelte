<script lang="ts">
	import 'chartjs-adapter-date-fns';
	import '$lib/styles/global.scss';
	import { Chart, registerables } from 'chart.js';
	import NavigationLoader from '$lib/components/NavigationLoader.svelte';
	import { setDefaultOptions } from 'date-fns';
	import { pl } from 'date-fns/locale';
	import ActionPoller from '$lib/components/ActionPoller.svelte';

	Chart.defaults.borderColor = '#545454';
	Chart.defaults.color = '#FFFFFF';

	Chart.register(...registerables);

	setDefaultOptions({ locale: pl });
</script>

<ActionPoller />
<NavigationLoader />
<slot />
