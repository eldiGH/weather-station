<script lang="ts">
	import AuthAgent from '$lib/components/AuthAgent.svelte';
	import Container from '$lib/components/Container.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
</script>

<Navbar />
<Container>
	<slot />
</Container>
<AuthAgent />
