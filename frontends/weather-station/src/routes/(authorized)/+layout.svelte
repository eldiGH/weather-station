<script lang="ts">
	import AppBar from '$lib/components/AppBar.svelte';
	import AuthAgent from 'frontend.shared/components/AuthAgent';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { onMount } from 'svelte';
	import { isLoggedIn } from 'frontend.shared/helpers/auth';
	import { goto } from '$app/navigation';

	onMount(() => {
		if (!isLoggedIn()) {
			goto('/login', { replaceState: true });
		}
	});
</script>

<AppBar>
	<Sidebar>
		<slot />
	</Sidebar>
</AppBar>
<AuthAgent />
