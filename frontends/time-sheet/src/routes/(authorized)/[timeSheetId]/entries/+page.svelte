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
	import IconInfo from '@shared/components/IconInfo.svelte';

	type StructuredTimeSheetEntry = InferMapValue<InferStoreType<typeof structuredEntries>>[number];

	interface Props {
		data: PageData;
	}

	const SCROLL_PIXELS_LEFT_BEFORE_RELOAD = 440;

	const { data }: Props = $props();

	let { entries } = $derived(data);
	let { finishedLoading, structuredEntries } = $derived(entries ?? {});

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
			handleScroll();
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

	let statsMap = $derived.by(() => {
		const statsMap = new Map<string, { totalPrice: number; count: number; hours: number }>();

		const structuredEntriesArray = $structuredEntries.entries().toArray();

		for (let i = 0; i < structuredEntriesArray.length; i++) {
			const [month, entries] = structuredEntriesArray[i];

			const shouldRenderStatsForMonth = $finishedLoading || structuredEntriesArray.length - 1 > i;

			if (!shouldRenderStatsForMonth) {
				break;
			}

			statsMap.set(
				month,
				entries.reduce(
					(acc, entry) => ({
						totalPrice: acc.totalPrice + entry.pricePerHour * entry.hours,
						hours: acc.hours + entry.hours,
						count: acc.count + 1
					}),
					{ totalPrice: 0, count: 0, hours: 0 }
				)
			);
		}

		return statsMap;
	});
</script>

{#snippet entrySnippet(entry: StructuredTimeSheetEntry)}
	<div transition:slide class="entry">
		<div class="entry-date">
			<span>{format(entry.date, 'dd.MM.yyyy')}</span>
			<span>{capitalize(format(entry.date, 'EEEE'))}</span>
		</div>
		<div>
			<div class="entry-details">
				<IconInfo height="1rem" size={22} gap={0.2} icon="schedule"
					>{pluralizePl(entry.hours, ['godzina', 'godziny', 'godzin'])}</IconInfo>
				<IconInfo height="1rem" size={22} gap={0.2} icon="attach_money"
					>{entry.pricePerHour * entry.hours}&nbsp;zł</IconInfo>
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

		{@const stats = statsMap.get(month)}
		<div out:slide>
			{#if stats}
				<div in:slide class="stats">
					<div class="stats-title">Podsumowanie</div>
					<div class="stats-items">
						<IconInfo gap={0.2} icon="calendar_month" size={22}
							>{pluralizePl(stats.count, ['wpis', 'wpisy', 'wpisów'])}</IconInfo>
						<IconInfo gap={0.2} icon="schedule" size={22}
							>{pluralizePl(stats.hours, ['godzina', 'godziny', 'godzin'])}</IconInfo>
						<IconInfo gap={0.2} icon="attach_money" size={22}>{stats.totalPrice}&nbsp;zł</IconInfo>
					</div>
				</div>
			{/if}
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
			padding: 1rem 0.3rem;

			border-bottom: 1px solid black;

			&-container {
				padding: 0 1rem;
			}

			.entry-details {
				display: flex;
				flex-direction: column;
				gap: 0.7rem;
			}

			&-actions {
				display: flex;
				gap: 0.5rem;
				align-items: center;
			}

			&-date {
				display: inline-flex;
				width: 91px;
				text-align: center;
				flex-direction: column;
				gap: 0.1rem;
			}
		}

		.stats {
			display: flex;
			flex-direction: column;
			align-items: center;

			padding: 1rem;

			&-title {
				font-size: 1.8rem;
			}

			&-items {
				padding-top: 1rem;
				display: flex;
				flex-direction: column;
				gap: 0.4rem;
				font-size: 1.2rem;
			}
		}
	}
</style>
