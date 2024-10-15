<script lang="ts">
	import { goto } from '$app/navigation';
	import Container from '@shared/components/Container.svelte';
	import { getTokensDataCookies, isLoggedIn } from '@shared/helpers/auth';
	import { onMount } from 'svelte';
	import AppBar from '@shared/components/AppBar.svelte';
	import SnackbarProvider from '@shared/components/SnackbarProvider.svelte';

	onMount(() => {
		if (!isLoggedIn(getTokensDataCookies())) {
			goto('/login', { replaceState: true });
		}
	});
</script>

<AppBar appName="Time sheet app">
	<div></div>
	<Container>
		<slot />
	</Container>
</AppBar>
<SnackbarProvider />
