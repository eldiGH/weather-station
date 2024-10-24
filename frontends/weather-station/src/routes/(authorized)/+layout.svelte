<script lang="ts">
	import AppBar from '$lib/components/AppBar.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { isLoggedIn, getTokensDataCookies } from '@shared/ui/helpers';

	onMount(() => {
		if (!isLoggedIn(getTokensDataCookies())) {
			goto('/login', { replaceState: true });
		}
	});
</script>

<AppBar />
<Sidebar>
	<slot />
</Sidebar>
