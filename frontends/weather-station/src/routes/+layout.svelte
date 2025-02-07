<script lang="ts">
	import 'chartjs-adapter-date-fns';
	import '@shared/ui/styles/global.scss';
	import { Chart, registerables } from 'chart.js';
	import { setDefaultOptions } from 'date-fns';
	import { pl } from 'date-fns/locale';
	import { browser } from '$app/environment';
	import ActionPoller from '$lib/components/ActionPoller.svelte';
	import { NavigationLoader } from '@shared/ui/components';
	import { BODY_PORTAL_KEY, createPortal } from '../../../shared/actions/portal';

	Chart.defaults.borderColor = '#545454';
	Chart.defaults.color = '#FFFFFF';

	Chart.register(...registerables);

	setDefaultOptions({ locale: pl });
</script>

<div class="body-portal" use:createPortal={BODY_PORTAL_KEY}></div>

{#if browser}
	<NavigationLoader />
{/if}

<ActionPoller />
<slot />

<style lang="scss">
	@use '@shared/ui/styles/themes' as t;
	@use '@shared/ui/styles/vars' as v;

	:root {
		@include t.add-theme('weather-station');
	}

	.body-portal {
		z-index: v.$loaderZIndex;
		position: relative;
	}
</style>
