<script lang="ts">
	import Button from '@shared/components/Button.svelte';
	import IconButton from '@shared/components/IconButton.svelte';
	import TopBar from '@shared/components/TopBar.svelte';
	import { logout } from '@shared/helpers/auth';
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

<TopBar {right} {left} />

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
