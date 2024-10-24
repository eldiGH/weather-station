<script lang="ts">
	import { logout } from '@shared/ui/helpers';
	import { sidebarStore } from '@shared/ui/stores';
	import { Button, IconButton, TopBar, Link } from '@shared/ui/components';
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
