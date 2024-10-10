<script lang="ts">
	import { logout } from '@shared/helpers/auth';
	import { sidebarStore } from '$lib/stores/sidebar';
	import Button from '@shared/components/Button.svelte';
	import IconButton from '@shared/components/IconButton.svelte';
	import TopBar from './TopBar.svelte';
	import Link from '@shared/components/Link.svelte';
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
