<script lang="ts">
	import Button from '@shared/components/Button.svelte';
	import IconButton from '@shared/components/IconButton.svelte';
	import TopBar from '@shared/components/TopBar.svelte';
	import { logout } from '@shared/helpers/auth';
</script>

{#snippet right()}
	<Button
		onclick={() => {
			logout();
		}}>Wyloguj</Button>
{/snippet}

{#snippet left()}
	<IconButton icon="arrow_back" size={25} iconSize={40} />
{/snippet}

<TopBar {right} {left} />
