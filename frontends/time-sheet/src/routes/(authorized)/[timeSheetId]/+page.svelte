<script lang="ts">
	import type { PageData } from './$types';
	import NumericInput from '@shared/components/NumericInput.svelte';
	import { format, getDaysInMonth } from 'date-fns';
	import { convertArrayToDict, formatToStringDate, getMonthsBoundaries } from 'backend/helpers';
	import Button from '@shared/components/Button.svelte';
	import { handleTRCPErrors, trpc } from '@shared/api/trpc';
	import { capitalize } from '@shared/helpers/string';
	import IconButton from '@shared/components/IconButton.svelte';
	import { addMonths } from 'date-fns/addMonths';
	import Loader from '@shared/components/Loader.svelte';
	import { invalidate } from '$app/navigation';
	import { CacheIdentifiers } from '$lib/constants/cache';

	interface Props {
		data: PageData;
	}

	type TimeSheet = PageData['timeSheet'];

	const { data }: Props = $props();

	let refreshedData: TimeSheet | null = $state(null);
	let timeSheetData: TimeSheet = $derived(refreshedData ?? data.timeSheet);

	interface MonthlyCalendarEntry {
		date: string;
		hours?: number;
		pricePerHour?: number;
	}

	let currentDate = $state(new Date());
	const daysInMonth = $derived(getDaysInMonth(currentDate));

	const getInitialMonthlyEntries = () => {
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
				pricePerHour: currentEntry?.pricePerHour ?? timeSheetData.defaultPricePerHour ?? 0
			} satisfies MonthlyCalendarEntry);
		}

		return initialMonthlyEntries;
	};

	let currentEntriesDict = $derived(convertArrayToDict(timeSheetData.entries, 'date'));
	let monthlyEntries = $derived.by(() => {
		const initialMonths = $state(getInitialMonthlyEntries());

		return initialMonths;
	});

	let isSavingTimeSheet = $state(false);
	const handleSave = async () => {
		const filteredEntries = monthlyEntries.filter(({ hours }) => hours > 0);

		isSavingTimeSheet = true;
		await trpc(fetch).timeSheet.setTimeSheetEntryForMonth.mutate({
			timeSheetId: timeSheetData.id,
			date: formatToStringDate(currentDate),
			entries: filteredEntries
		});
		isSavingTimeSheet = false;
		invalidate(CacheIdentifiers.API_TIME_SHEETS_LIST);
	};

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
		const { data, wasAborted } = await handleTRCPErrors(
			trpc(fetch).timeSheet.getTimeSheet.query,
			{
				id: timeSheetData.id,
				dates: getMonthsBoundaries(currentDate)
			},
			{ signal: timeSheetFetchAbort.signal }
		);

		if (data) {
			refreshedData = data;
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
	<div class="timesheet">
		{#each monthlyEntries as entry}
			{@render timeEntry(entry)}
		{/each}
		<Loader sticky overlay show={shouldDisableTimeSheetInputs} delayMs={500} />
	</div>
	<div class="footer">
		<Button disabled={isSavingTimeSheet} on:click={handleSave}>Zapisz</Button>
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
			padding: 2rem 1rem;
			font-size: 2rem;
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 0.5rem;
			position: sticky;
			top: 0;
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

		.timesheet {
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
