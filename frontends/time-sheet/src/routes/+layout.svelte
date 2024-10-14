<script lang="ts">
	import '@shared/styles/global.scss';
	import { browser } from '$app/environment';
	import ActionPoller from '@shared/components/ActionPoller.svelte';
	import AuthAgent from '@shared/components/AuthAgent.svelte';
	import NavigationLoader from '@shared/components/NavigationLoader.svelte';
	import { setDefaultOptions } from 'date-fns';
	import { pl } from 'date-fns/locale';

	setDefaultOptions({ locale: pl });
</script>

{#if browser}
	<NavigationLoader />
{/if}

<ActionPoller />
<AuthAgent />
<slot />

<style lang="scss">
	@use '@shared/styles/themes.scss' as t;

	:root {
		@include t.add-theme('time-sheet');
	}
</style>
