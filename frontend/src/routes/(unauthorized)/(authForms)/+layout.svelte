<script>
	import Container from '$lib/components/Container.svelte';

	// TODO: Add redirection for client-side, when accessing /login or /register routes while logged in
	// onMount(() => {
	// 	goto('/', { replaceState: true });
	// });
</script>

<Container><div><slot /></div></Container>

<style lang="scss">
	div {
		display: flex;
		width: 100%;
		height: 100%;
		align-items: center;
		justify-content: center;
	}
</style>
