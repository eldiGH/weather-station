<script lang="ts">
	import '@shared/styles/global.scss';
	import { browser } from '$app/environment';
	import NavigationLoader from '@shared/components/NavigationLoader.svelte';
	import { setDefaultOptions } from 'date-fns';
	import { pl } from 'date-fns/locale';
	import type { LayoutProps } from '@shared/types/LayoutProps';

	setDefaultOptions({ locale: pl });

	const { children }: LayoutProps = $props();
</script>

{#if browser}
	<NavigationLoader />
{/if}

{@render children()}

<style lang="scss">
	@use '@shared/styles/theme' as t;

	:root {
		@include t.add-theme('time-sheet');
	}
</style>
