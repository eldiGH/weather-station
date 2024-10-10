<script lang="ts">
	import { goto } from '$app/navigation';
	import Container from '@shared/components/Container.svelte';
	import { isLoggedIn } from '@shared/helpers/auth';
	import { onMount } from 'svelte';

	onMount(() => {
		if (!isLoggedIn()) {
			goto('/login', { replaceState: true });
		}
	});
</script>

<Container>
	<slot />
</Container>
