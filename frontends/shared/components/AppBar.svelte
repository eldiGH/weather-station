<script lang="ts">
	import { logout } from '@shared/helpers/auth';
	import { sidebarStore } from '@shared/stores/sidebar';
	import Button from '@shared/components/Button.svelte';
	import IconButton from '@shared/components/IconButton.svelte';
	import TopBar from './TopBar.svelte';
	import Link from '@shared/components/Link.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		appName: string;
		children: Snippet;
	}

	const { appName, children }: Props = $props();
</script>

<TopBar>
	<div slot="left" class="left">
		<IconButton onclick={sidebarStore.toggle} icon="menu" size={24} />
		<Link noColor class="header" href="/">{appName}</Link>
	</div>
	<Button slot="right" on:click={() => logout()}>Wyloguj</Button>
	{@render children()}
</TopBar>

<style lang="scss">
	.left {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
