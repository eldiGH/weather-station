<script lang="ts">
	import { goto } from '$app/navigation';
	import { Container, SnackbarProvider } from '@shared/ui/components';
	import { getTokensDataCookies, isLoggedIn } from '@shared/ui/helpers';
	import { onMount } from 'svelte';
	import AppBar from '$lib/components/AppBar.svelte';

	const { children } = $props();

	onMount(() => {
		if (!isLoggedIn(getTokensDataCookies())) {
			goto('/login', { replaceState: true });
		}
	});
</script>

<AppBar />
<Container>
	{@render children?.()}
</Container>
<SnackbarProvider />
