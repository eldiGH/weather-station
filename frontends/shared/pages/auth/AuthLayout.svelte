<script lang="ts">
	import { goto } from '$app/navigation';
	import Container from '../../components/Container.svelte';
	import { getTokensDataCookies, isLoggedIn } from '../../helpers/auth';
	import { onMount } from 'svelte';

	onMount(() => {
		if (isLoggedIn(getTokensDataCookies())) {
			goto('/', { replaceState: true });
		}
	});
</script>

<Container pt={5}><div><slot /></div></Container>

<style lang="scss">
	div {
		display: flex;
		width: 100%;
		height: 100%;
		align-items: center;
		justify-content: center;
	}
</style>
