<script lang="ts">
	import { format } from 'date-fns';
	import type { PageData } from './$types';
	import { capitalize } from '@shared/helpers/string';
	import { pluralizePl } from '@shared/helpers/language';
	import IconButton from '@shared/components/IconButton.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { getBodyHeight } from '$lib/helpers/dom';
	import { browser } from '$app/environment';
	import Skeleton from '$lib/components/Skeleton.svelte';
	import type { InferStoreType } from '@shared/types/Store';
	import type { InferMapValue } from '@shared/types/Map';
	import { slide } from 'svelte/transition';
	import ConfirmationDialog from '@shared/components/ConfirmationDialog.svelte';
	import AddEditTimeSheetEntryDialog from '$lib/components/AddEditTimeSheetEntryDialog.svelte';

	type StructuredTimeSheetEntry = InferMapValue<InferStoreType<typeof structuredEntries>>[number];

	interface Props {
		data: PageData;
	}

	const SCROLL_PIXELS_LEFT_BEFORE_RELOAD = 440;

	const { data }: Props = $props();

	const { entries } = $derived(data);
	const { finishedLoading, structuredEntries } = $derived(entries);

	let loadMorePromise: Promise<boolean> | null = null;
	const loadMoreEntries = async () => {
		if (loadMorePromise) {
			return;
		}

		loadMorePromise = entries.loadMore();
		await loadMorePromise;
		loadMorePromise = null;
	};

	const handleScroll = () => {
		if ($finishedLoading) {
			document.removeEventListener('scroll', handleScroll);
			return;
		}

		const y = window.scrollY + window.innerHeight;

		const totalHeight = getBodyHeight();

		if (totalHeight - y <= SCROLL_PIXELS_LEFT_BEFORE_RELOAD) {
			loadMoreEntries();
		}
	};

	onMount(() => {
		if (!$finishedLoading) {
			document.addEventListener('scroll', handleScroll);
		}
	});

	onDestroy(() => {
		if (browser) {
			document.removeEventListener('scroll', handleScroll);
		}
	});

	let openDeleteDialog: (() => void) | undefined = $state();
	let openAddEditDialog: (() => void) | undefined = $state();
	let selectedEntry: StructuredTimeSheetEntry | null = $state(null);

	// let stats = $derived.by(() => {
	// 	for (const [month, entries] of $structuredEntries.entries()) {
	// 		const shouldRenderStatsForMonth =
	// 			$finishedLoading || $entries.length - 1 > entries[entries.length - 1].entryIndex;
	// 	}
	// });
</script>

{#snippet entrySnippet(entry: StructuredTimeSheetEntry)}
	<div transition:slide class="entry">
		<div>{format(entry.date, 'dd.MM.yyyy')}</div>
		<div>
			<div class="entry-details">
				<div>{pluralizePl(entry.hours, ['godzina', 'godziny', 'godzin'])}</div>
				<div>{entry.pricePerHour * entry.hours}&nbsp;zł</div>
			</div>
		</div>
		<div class="entry-actions">
			<IconButton
				size={23}
				icon="edit"
				onclick={() => {
					selectedEntry = entry;
					openAddEditDialog?.();
				}} />
			<IconButton
				variant="danger"
				size={23}
				icon="delete"
				onclick={() => {
					selectedEntry = entry;
					openDeleteDialog?.();
				}} />
		</div>
	</div>
{/snippet}

<div class="root">
	{#each $structuredEntries.entries() as [month, entries] (month)}
		<div transition:slide class="month-title">{capitalize(format(month, 'LLLL yyyy'))}</div>

		<div transition:slide class="entry-container">
			{#each entries as entry (entry.date)}
				{@render entrySnippet(entry)}
			{/each}
		</div>
	{/each}
	{#if !$finishedLoading}
		<div class="entry-container">
			{#each Array(3) as _}
				<Skeleton>
					{@render entrySnippet({ date: '2024-10-20', entryIndex: 0, hours: 10, pricePerHour: 20 })}
				</Skeleton>
			{/each}
		</div>
	{/if}
</div>

<IconButton
	icon="add"
	size={40}
	iconSize={40}
	shadow
	floating={{ right: '1rem', bottom: '1rem' }}
	onclick={() => {
		selectedEntry = null;
		openAddEditDialog?.();
	}} />

<ConfirmationDialog
	title="Usunięcie wpisu"
	bind:open={openDeleteDialog}
	onConfirm={async () => {
		if (!selectedEntry) {
			return false;
		}
		const success = await entries.delete(selectedEntry);
		if (!success) {
			return false;
		}

		handleScroll();
		return true;
	}}>Czy na pewno chcesz usunąć</ConfirmationDialog>

<AddEditTimeSheetEntryDialog
	onAdd={entries.add}
	onEdit={(entry) => entries.edit(entry, selectedEntry)}
	bind:open={openAddEditDialog}
	timeSheet={data.timeSheet}
	editEntry={selectedEntry}
	entries={$entries} />

<style lang="scss">
	.root {
		padding-bottom: 8rem;

		.month-title {
			font-size: 2.5rem;
			padding: 2rem 0 2rem 1.5rem;
		}

		.entry {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 1rem 0.5rem;

			border-bottom: 1px solid black;

			&-container {
				padding: 0 1.5rem;
			}

			.entry-details {
				display: flex;
				flex-direction: column;
				gap: 0.5rem;
			}

			&-actions {
				display: flex;
				gap: 0.5rem;
				align-items: center;
			}
		}
	}
</style>
