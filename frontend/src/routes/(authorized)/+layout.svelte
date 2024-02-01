<script lang="ts">
	import AppBar from '$lib/components/AppBar.svelte';
	import AuthAgent from '$lib/components/AuthAgent.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
</script>

<AppBar>
	<Sidebar>
		<slot />
	</Sidebar>
</AppBar>
<AuthAgent />
