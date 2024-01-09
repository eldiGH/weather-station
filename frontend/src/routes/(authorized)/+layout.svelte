<script lang="ts">
	import AppBar from '$lib/components/AppBar.svelte';
	import AuthAgent from '$lib/components/AuthAgent.svelte';
</script>

<AppBar>
	<slot />
</AppBar>
<AuthAgent />
