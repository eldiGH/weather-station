<script lang="ts">
	import { goto } from '$app/navigation';
	import Container from '@shared/components/Container.svelte';
	import { getTokensDataCookies, isLoggedIn } from '@shared/helpers/auth';
	import { onMount } from 'svelte';
	import SnackbarProvider from '@shared/components/SnackbarProvider.svelte';
	import AppBar from '$lib/components/AppBar.svelte';

	onMount(() => {
		if (!isLoggedIn(getTokensDataCookies())) {
			goto('/login', { replaceState: true });
		}
	});
</script>

<AppBar />
<Container>
	<slot />
</Container>
<SnackbarProvider />
