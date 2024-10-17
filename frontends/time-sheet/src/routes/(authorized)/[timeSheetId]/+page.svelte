<script lang="ts">
	import type { PageData } from './$types';
	import NumericInput from '@shared/components/NumericInput.svelte';
	import { format, getDaysInMonth } from 'date-fns';
	import { convertArrayToDict, formatToStringDate, getMonthsBoundaries } from 'backend/helpers';
	import Button from '@shared/components/Button.svelte';
	import { handleAuthedTRPCErrors, trpc } from '@shared/api/trpc';
	import { capitalize } from '@shared/helpers/string';
	import IconButton from '@shared/components/IconButton.svelte';
	import { addMonths } from 'date-fns/addMonths';
	import Loader from '@shared/components/Loader.svelte';
	import { invalidate } from '$app/navigation';
	import { CacheIdentifiers } from '$lib/constants/cache';
	import { writable } from 'svelte/store';
	import { snackbar } from '@shared/helpers/snackbar';

	interface Props {
		data: PageData;
	}

	type TimeSheet = PageData['timeSheet'];
	type TimeSheetEntry = TimeSheet['entries'][number];

	type CurrentTimeSheetEntry = Omit<TimeSheetEntry, 'createdAt'> & { createdAt?: Date };
	type CurrentTimeSheet = Omit<TimeSheet, 'entries'> & { entries: CurrentTimeSheetEntry[] };

	const { data }: Props = $props();

	interface MonthlyCalendarEntry {
		date: string;
		hours?: number;
		pricePerHour?: number;
		createdAt?: Date;
	}

	const timeSheetEntries = writable<CurrentTimeSheet>(data.timeSheet);

	let currentDate = $state(new Date());
	const daysInMonth = $derived(getDaysInMonth(currentDate));

	let currentEntriesDict = $derived(convertArrayToDict($timeSheetEntries.entries, 'date'));

	let initialMonthlyEntries = $derived.by(() => {
		const initialMonthlyEntries = [];

		for (let i = daysInMonth; i >= 1; i--) {
			const date = format(
				currentDate,
				`yyyy-MM-${i.toLocaleString('en-US', { minimumIntegerDigits: 2 })}`
			);
			const currentEntry = currentEntriesDict[date];

			initialMonthlyEntries.push({
				date,
				hours: currentEntry?.hours ?? 0,
				pricePerHour: currentEntry?.pricePerHour ?? $timeSheetEntries.defaultPricePerHour ?? 0,
				createdAt: currentEntry?.createdAt
			} satisfies MonthlyCalendarEntry);
		}

		return initialMonthlyEntries;
	});

	let monthlyEntries = $derived.by(() => {
		const entries = $state(initialMonthlyEntries);
		return entries;
	});

	let isSavingTimeSheet = $state(false);
	const handleSave = async () => {
		const filteredEntries = monthlyEntries.filter(({ hours }) => hours > 0);

		isSavingTimeSheet = true;

		const { error } = await handleAuthedTRPCErrors(
			trpc(fetch).timeSheet.setTimeSheetEntryForMonth.mutate,
			{
				timeSheetId: $timeSheetEntries.id,
				date: formatToStringDate(currentDate),
				entries: filteredEntries
			}
		);

		isSavingTimeSheet = false;
		if (error) {
			snackbar.pushError('Coś poszło nie tak, spróbuj ponownie później');
			return;
		}

		invalidate(CacheIdentifiers.API_TIME_SHEETS_LIST);
		snackbar.pushSuccess('Zapisano');

		timeSheetEntries.update((t) => ({
			...t,
			entries: monthlyEntries.filter((entry) => entry.hours > 0)
		}));
	};

	let isTimeSheetModified = $derived.by(() => {
		for (let i = 0; i < monthlyEntries.length; i++) {
			if (
				monthlyEntries[i].hours !== initialMonthlyEntries[i].hours ||
				monthlyEntries[i].pricePerHour !== initialMonthlyEntries[i].pricePerHour
			) {
				return true;
			}
		}
		return false;
	});

	let isRefetchingTimeSheet = $state(false);
	let timeSheetFetchAbort: AbortController | null = null;
	const changeCurrentMonth = async (relativeMonths: number) => {
		currentDate = addMonths(currentDate, relativeMonths);
		window.scrollTo({ top: 0, behavior: 'smooth' });

		if (timeSheetFetchAbort) {
			timeSheetFetchAbort.abort();
		}

		timeSheetFetchAbort = new AbortController();

		isRefetchingTimeSheet = true;
		const { data, wasAborted } = await handleAuthedTRPCErrors(
			trpc(fetch).timeSheet.getTimeSheet.query,
			{
				id: $timeSheetEntries.id,
				dates: getMonthsBoundaries(currentDate)
			},
			{ signal: timeSheetFetchAbort.signal }
		);

		if (data) {
			timeSheetEntries.set(data);
		}

		if (!wasAborted) {
			isRefetchingTimeSheet = false;
			timeSheetFetchAbort = null;
		}
	};

	const shouldDisableTimeSheetInputs = $derived(isRefetchingTimeSheet || isSavingTimeSheet);
</script>

{#snippet timeEntry(timeSheetEntry: MonthlyCalendarEntry)}
	<div class="entry">
		<span>{format(timeSheetEntry.date, 'd. MMMM yyyy')}</span>
		<NumericInput
			centerText
			min={0}
			max={24}
			incButton
			decButton
			label="Czas"
			short
			disabled={shouldDisableTimeSheetInputs}
			bind:value={timeSheetEntry.hours} />
	</div>
{/snippet}

<div class="root">
	<div class="header">
		<IconButton
			iconSize={30}
			size={20}
			icon="chevron_left"
			onclick={() => changeCurrentMonth(-1)}
			disabled={isSavingTimeSheet} />
		{capitalize(format(currentDate, 'LLLL yyyy'))}
		<IconButton
			iconSize={30}
			size={20}
			icon="chevron_right"
			onclick={() => changeCurrentMonth(1)}
			disabled={isSavingTimeSheet} />
	</div>
	<div class="time-sheet">
		{#each monthlyEntries as entry}
			{@render timeEntry(entry)}
		{/each}
		<Loader sticky overlay show={shouldDisableTimeSheetInputs} delayMs={500} />
	</div>
	<div class="footer">
		<Button
			busy={isSavingTimeSheet}
			disabled={shouldDisableTimeSheetInputs || !isTimeSheetModified}
			onclick={handleSave}>Zapisz</Button>
	</div>
</div>

<style lang="scss">
	@use '@shared/styles/vars' as v;

	.root {
		display: flex;
		flex-direction: column;
		align-items: center;

		& .header {
			border-bottom: 1px solid black;
			width: 100%;
			padding: 1rem 1rem;
			font-size: 2rem;
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 0.5rem;
			position: sticky;
			top: v.$topBarHeight;
			z-index: 1;
			background-color: white;
			z-index: v.$loaderZIndex + 1;
		}

		.footer {
			position: sticky;
			bottom: 0;
			z-index: 1;
			background-color: white;
			display: flex;
			width: 100%;
			justify-content: center;
			padding: 1rem;
			border-top: 1px solid black;
			z-index: v.$loaderZIndex + 1;
		}

		.time-sheet {
			position: relative;
			width: 100%;
		}
	}

	.entry {
		width: 100%;
		border-bottom: 2px dotted black;
		display: flex;
		justify-content: space-around;
		height: 100px;
		align-items: center;
		padding-right: 1rem;
	}
</style>
