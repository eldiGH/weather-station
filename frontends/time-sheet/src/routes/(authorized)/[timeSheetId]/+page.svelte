<script lang="ts">
	import Button from '@shared/components/Button.svelte';
	import Icon from '@shared/components/Icon.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	type TimeSheetEntry = PageData['timeSheet']['entries'][number];

	const { data }: Props = $props();
</script>

{#snippet timeEntry(timeSheetEntry: TimeSheetEntry)}
	<div class="entry"></div>
{/snippet}

<div>
	<Button><Icon icon="add" />Dodaj wpis</Button>
</div>

{#if data.timeSheet.entries.length === 0}
	Brak wpisów
{:else}
	{#each data.timeSheet.entries as entry}
		{@render timeEntry(entry)}
	{/each}
{/if}

<style lang="scss">
	.entry {
		border-bottom: 1px solid black;
	}
</style>
