<script>
	import { logout } from 'frontend.shared/helpers/auth';
	import { sidebarStore } from '$lib/stores/sidebar';
	import Button from './Button.svelte';
	import IconButton from './IconButton.svelte';
	import Link from './Link.svelte';
	import TopBar from './TopBar.svelte';
</script>

<TopBar>
	<div slot="left" class="left">
		<IconButton on:click={sidebarStore.toggle} icon="menu" size={24} />
		<Link noColor class="header" href="/">Weather station app</Link>
	</div>
	<Button slot="right" on:click={() => logout()}>Wyloguj</Button>
	<slot />
</TopBar>

<style lang="scss">
	.left {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
