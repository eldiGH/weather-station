<script lang="ts">
	import '@shared/styles/global.scss';
	import { browser } from '$app/environment';
	import ActionPoller from '@shared/components/ActionPoller.svelte';
	import NavigationLoader from '@shared/components/NavigationLoader.svelte';
</script>

{#if browser}
	<NavigationLoader />
{/if}

<ActionPoller />
<slot />

<style lang="scss">
	@use '@theme' as t;

	:root {
		@include t.add-theme('time-sheet');
	}
</style>
