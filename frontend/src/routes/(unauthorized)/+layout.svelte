<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		// goto('/', { replaceState: true });
	});
</script>

<Container>
	<slot />
</Container>
