<script lang="ts">
	import 'overlayscrollbars/overlayscrollbars.css';
	import 'agnostic-svelte/css/common.min.css';
	import 'chartjs-adapter-date-fns';
	import '$lib/styles/global.scss';
	import { Chart } from 'chart.js';
	import NavigationLoader from '$lib/components/NavigationLoader.svelte';

	Chart.defaults.borderColor = '#545454';
	Chart.defaults.color = '#FFFFFF';
</script>

<NavigationLoader />
<slot />
