<script>
	import { logout } from '$lib/helpers/auth';
	import Button from './Button.svelte';
	import Link from './Link.svelte';
	import TopBar from './TopBar.svelte';
</script>

<TopBar>
	<Link slot="left" noColor class="header" href="/">Weather station app</Link>
	<Button slot="right" on:click={() => logout()}>Wyloguj</Button>
	<slot />
</TopBar>
