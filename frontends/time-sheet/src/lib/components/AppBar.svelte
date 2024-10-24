<script lang="ts">
	import { IconButton, Button, TopBar } from '@shared/ui/components';
	import { logout } from '@shared/ui/helpers';
	import { page } from '$app/stores';

	let isRootPage = $derived($page.url.pathname === '/');
</script>

{#snippet left()}
	{#if !isRootPage}
		<IconButton fade icon="arrow_back" size={25} iconSize={40} href="../" />
	{/if}
{/snippet}

{#snippet right()}
	<Button
		onclick={() => {
			logout();
		}}>Wyloguj</Button>
{/snippet}

<TopBar class="top-bar-navigation" {right} {left} />

{#if !isRootPage}
	<IconButton
		fade
		icon="arrow_back"
		floating={{ left: 'calc(50% - 9rem)', bottom: '1rem' }}
		onTop
		size={40}
		iconSize={40}
		shadow
		href="../" />
{/if}

<style lang="scss">
	:global {
		.top-bar-navigation {
			view-transition-name: app-bar;
		}
	}
</style>
