<script lang="ts">
	import AppBar from '@shared/components/AppBar.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { onMount } from 'svelte';
	import { getTokensDataCookies, isLoggedIn } from '@shared/helpers/auth';
	import { goto } from '$app/navigation';

	onMount(() => {
		if (!isLoggedIn(getTokensDataCookies())) {
			goto('/login', { replaceState: true });
		}
	});
</script>

<AppBar appName="Weather station">
	<Sidebar>
		<slot />
	</Sidebar>
</AppBar>
