<script lang="ts">
	import type { LayoutData } from './$types';

	interface Props {
		data: LayoutData;
	}

	const { data }: Props = $props();

	$effect(() => {
		console.log(data);
	});
</script>

{#if data.timeSheets.length === 0}
	Nie masz żadnej karty czasu.
{:else}
	{#each data.timeSheets as timeSheet}
		<div>{timeSheet.name}</div>
	{/each}
{/if}
