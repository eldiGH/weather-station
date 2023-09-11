<script lang="ts">
	import AuthAgent from '$lib/components/AuthAgent.svelte';
	import Container from '$lib/components/Container.svelte';
	import Navbar from '$lib/components/AppBar.svelte';
	import AppBar from '$lib/components/AppBar.svelte';
</script>

<AppBar>
	<slot />
</AppBar>
<AuthAgent />
