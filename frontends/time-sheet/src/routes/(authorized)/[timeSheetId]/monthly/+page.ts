import { trpcAuthed } from '@shared/ui/api';
import type { PageLoad } from './$types';
import { get } from 'svelte/store';
import { writable } from 'svelte/store';
import { addMonths, getDaysInMonth, setDate } from 'date-fns';
import { convertArrayToDict, formatToStringDate, shallowEqual } from 'backend/helpers';
import { snackbar } from '@shared/ui/helpers';
import type { AppRouterOutputs } from 'backend/trpc';
import { derived } from 'svelte/store';
import type { ExtractResponseDataType } from 'backend/types';

type TimeSheetEntry = ExtractResponseDataType<
	AppRouterOutputs['timeSheet']['getTimeSheetForMonth']
>[number];
type TimeSheet = ExtractResponseDataType<AppRouterOutputs['timeSheet']['getTimeSheets']>[number];

const getInitialEntries = (entries: TimeSheetEntry[], date: Date, timeSheet: TimeSheet) => {
	const initialMonthlyEntries: TimeSheetEntry[] = [];

	const entriesDict = convertArrayToDict(entries, 'date');

	for (let i = getDaysInMonth(date); i >= 1; i--) {
		const dateString = formatToStringDate(setDate(date, i));
		const existingEntry = entriesDict[dateString];

		let entry;

		if (existingEntry) {
			entry = { ...existingEntry };
		} else {
			entry = {
				date: dateString,
				hours: 0,
				pricePerHour: timeSheet.defaultPricePerHour ?? 0
			};
		}

		initialMonthlyEntries.push(entry);
	}

	return initialMonthlyEntries;
};

export const load: PageLoad = async ({ fetch, params, parent }) => {
	const { timeSheets } = await parent();
	const timeSheet = get(timeSheets).find((t) => t.id === params.timeSheetId);

	if (!timeSheet) {
		throw Error('Time sheet not found');
	}

	const currentDate = new Date();

	const { data, error } = await trpcAuthed(fetch).timeSheet.getTimeSheetForMonth.query({
		timeSheetId: params.timeSheetId,
		date: currentDate
	});
	if (error) {
		throw error;
	}

	let initialMonthDataDict = convertArrayToDict(data, 'date');

	const selectedMonth = writable(currentDate);
	const monthlyEntriesStore = writable(getInitialEntries(data, currentDate, timeSheet));

	const isModified = derived([monthlyEntriesStore], ([$monthlyEntries]) => {
		const entriesDict: Record<string, TimeSheetEntry | undefined> = convertArrayToDict(
			$monthlyEntries.filter((e) => e.hours > 0),
			'date'
		);

		const initialMonthDataDictKeys = Object.keys(initialMonthDataDict);
		const entriesDictKeys = Object.keys(entriesDict);

		if (initialMonthDataDictKeys.length !== entriesDictKeys.length) {
			return true;
		}

		for (const date of entriesDictKeys) {
			const entry = entriesDict[date];
			const initialEntry = initialMonthDataDict[date];

			if (!initialEntry || !entry) {
				return true;
			}

			if (!shallowEqual(entry, initialEntry)) {
				return true;
			}
		}

		return false;
	});

	return {
		timeSheet,
		entries: {
			...monthlyEntriesStore,
			save: async () => {
				const filteredEntries = get(monthlyEntriesStore).filter(({ hours }) => hours > 0);

				const timeSheetDate = get(selectedMonth);

				const { error } = await trpcAuthed(fetch).timeSheet.setTimeSheetEntryForMonth.mutate({
					timeSheetId: timeSheet.id,
					date: get(selectedMonth),
					entries: filteredEntries
				});

				if (error) {
					snackbar.pushError('Coś poszło nie tak, spróbuj ponownie później');
					return;
				}

				timeSheets.recalculateStats(timeSheetDate, timeSheet.id, filteredEntries);

				snackbar.pushSuccess('Zapisano.');
			},

			changeMonth: async (relativeMonths: number) => {
				const newDate = addMonths(get(selectedMonth), relativeMonths);

				const { data, error } = await trpcAuthed(fetch).timeSheet.getTimeSheetForMonth.query({
					timeSheetId: params.timeSheetId,
					date: newDate
				});

				if (error) {
					snackbar.pushError();
					return false;
				}

				initialMonthDataDict = convertArrayToDict(data, 'date');
				selectedMonth.set(newDate);
				monthlyEntriesStore.set(getInitialEntries(data, newDate, timeSheet));
			}
		},
		selectedMonth: { subscribe: selectedMonth.subscribe },
		isModified: { subscribe: isModified.subscribe }
	};
};
