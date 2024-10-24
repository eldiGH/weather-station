<script lang="ts">
	import { goto } from '$app/navigation';
	import Container from '../../components/Container.svelte';
	import { getTokensDataCookies, isLoggedIn } from '../../helpers/auth';
	import { onMount } from 'svelte';
	import type { LayoutProps } from '../../types/LayoutProps'


	const { children }: LayoutProps = $props();

	onMount(() => {
		if (isLoggedIn(getTokensDataCookies())) {
			goto('/', { replaceState: true });
		}
	});
</script>

<Container pt={5}><div>{@render children()}</div></Container>

<style lang="scss">
	div {
		display: flex;
		width: 100%;
		height: 100%;
		align-items: center;
		justify-content: center;
	}
</style>
