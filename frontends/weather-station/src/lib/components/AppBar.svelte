<script lang="ts">
	import { logout } from '@shared/helpers/auth';
	import { sidebarStore } from '@shared/stores/sidebar';
	import Button from '@shared/components/Button.svelte';
	import IconButton from '@shared/components/IconButton.svelte';
	import TopBar from '@shared/components/TopBar.svelte';
	import Link from '@shared/components/Link.svelte';
</script>

{#snippet left()}
	<div class="left">
		<IconButton onclick={sidebarStore.toggle} icon="menu" size={24} />
		<Link noColor class="header" href="/">Weather station app</Link>
	</div>
{/snippet}

{#snippet right()}
	<Button onclick={() => logout()}>Wyloguj</Button>
{/snippet}

<TopBar {left} {right} />

<style lang="scss">
	.left {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
