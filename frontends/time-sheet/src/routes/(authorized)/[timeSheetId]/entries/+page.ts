import { get } from 'svelte/store';
import type { PageLoad } from './$types';
import { handleAuthedTRPCErrors, trpc } from '@shared/ui/api';
import { writable } from 'svelte/store';
import { derived } from 'svelte/store';
import { addDays, isAfter, isBefore, isSameMonth } from 'date-fns';
import type { AppRouterOutputs } from 'backend/trpc';
import { snackbar } from '@shared/ui/helpers';
import { getFirstDateOfMonth } from 'backend/helpers';
import type { SetTimeSheetEntryInput } from 'backend/schemas';
import { addIntoDateSortedObjectArray } from '$lib/helpers/date';
import { ApiErrorCode } from 'backend/types';

type TimeSheetEntry =
	AppRouterOutputs['timeSheet']['getTimeSheetEntriesWithCursor']['entries'][number];
type StructuredEntry = TimeSheetEntry & { entryIndex: number };

const ENTRIES_PER_LOAD_COUNT = 15;

export const load: PageLoad = async ({ fetch, params, parent }) => {
	const { timeSheets } = await parent();

	const timeSheet = get(timeSheets).find((t) => t.id === params.timeSheetId);

	if (!timeSheet) {
		throw Error('Time sheet not found');
	}

	const response = await handleAuthedTRPCErrors(
		trpc(fetch).timeSheet.getTimeSheetEntriesWithCursor.query,
		{
			timeSheetId: timeSheet.id,
			count: ENTRIES_PER_LOAD_COUNT
		}
	);

	type ResponseType = typeof response;

	const { data, error } = response;

	if (error) {
		throw error;
	}

	const nextCursorStore = writable<string | undefined>(data.nextCursor);
	const entriesStore = writable(data.entries);
	const finishedLoading = derived([nextCursorStore], ([$nextCursor]) => !$nextCursor);

	const structuredEntries = derived([entriesStore], ([$entries]) => {
		const structuredEntries: Map<string, StructuredEntry[]> = new Map();

		if ($entries.length === 0) {
			return structuredEntries;
		}

		let currentMonth = getFirstDateOfMonth($entries[0].date);
		let currentMonthEntries: StructuredEntry[] = [];

		const iterator = $entries.values().map((v, i) => ({ ...v, entryIndex: i }));

		for (const entry of iterator) {
			if (isSameMonth(entry.date, currentMonth)) {
				currentMonthEntries.push(entry);
				continue;
			}

			structuredEntries.set(currentMonth, currentMonthEntries);
			currentMonth = getFirstDateOfMonth(entry.date);
			currentMonthEntries = [entry];
		}

		structuredEntries.set(currentMonth, currentMonthEntries);

		return structuredEntries;
	});

	const updateEntriesStore = (entry: SetTimeSheetEntryInput) => {
		entriesStore.update((entries) => {
			if (entries.length === 0) {
				return [entry];
			}

			const { timeSheetId, ...entryData } = entry;

			if (entries.find((e) => e.date === entry.date)) {
				return entries.map((e) => (e.date === entry.date ? entry : e));
			}

			const from = entries[0].date;
			const to = get(nextCursorStore) ?? entries[entries.length - 1].date;

			if (isAfter(entry.date, from)) {
				return [entryData, ...entries];
			}

			if (isBefore(entry.date, to)) {
				return [...entries, entryData];
			}

			if (isBefore(entry.date, from) && isAfter(entry.date, addDays(to, 1))) {
				return addIntoDateSortedObjectArray(entries, 'date', entryData);
			}

			return entries;
		});
	};

	let loadMorePromise: Promise<ResponseType> | null = null;

	return {
		timeSheet,
		entries: {
			finishedLoading,
			structuredEntries,
			subscribe: entriesStore.subscribe,

			loadMore: async () => {
				const nextCursor = get(nextCursorStore);

				if (!nextCursor) {
					return true;
				}

				if (loadMorePromise) {
					return !nextCursor;
				}

				loadMorePromise = handleAuthedTRPCErrors(
					trpc(fetch).timeSheet.getTimeSheetEntriesWithCursor.query,
					{
						timeSheetId: timeSheet.id,
						cursor: nextCursor,
						count: ENTRIES_PER_LOAD_COUNT
					}
				);

				const { error, data } = await loadMorePromise;
				loadMorePromise = null;

				if (error) {
					throw error;
				}

				nextCursorStore.set(data.nextCursor);

				entriesStore.update((e) => [...e, ...data.entries]);

				if (!nextCursor) {
					return true;
				}
				return false;
			},

			delete: async (entry: TimeSheetEntry) => {
				const { error } = await handleAuthedTRPCErrors(
					trpc(fetch).timeSheet.deleteTimeSheetEntry.mutate,
					{
						date: entry.date,
						timeSheetId: timeSheet.id
					}
				);

				if (error) {
					snackbar.pushError();
					return false;
				}

				entriesStore.update((entries) => entries.filter((e) => e.date !== entry.date));
				snackbar.pushSuccess('Pomyślnie usunięto.');

				timeSheets.updateStats(entry.date, timeSheet.id, ({ count, hours, totalPrice }) => ({
					count: count - 1,
					hours: hours - entry.hours,
					totalPrice: totalPrice - entry.hours * entry.pricePerHour
				}));

				return true;
			},

			add: async (entry: SetTimeSheetEntryInput) => {
				const { error } = await handleAuthedTRPCErrors(
					trpc(fetch).timeSheet.addTimeSheetEntry.mutate,
					entry
				);

				if (error) {
					if (error.errorCode === ApiErrorCode.TIME_SHEET_ENTRY_ALREADY_EXISTS) {
						return error;
					}

					snackbar.pushError();
					return false;
				}

				updateEntriesStore(entry);

				timeSheets.updateStats(entry.date, entry.timeSheetId, ({ count, hours, totalPrice }) => ({
					count: count + 1,
					hours: hours + entry.hours,
					totalPrice: totalPrice + entry.hours * entry.pricePerHour
				}));

				snackbar.pushSuccess('Pomyślnie dodano.');
				return true;
			},

			edit: async (entry: SetTimeSheetEntryInput, oldEntry: TimeSheetEntry | null) => {
				const { error } = await handleAuthedTRPCErrors(
					trpc(fetch).timeSheet.editTimeSheetEntry.mutate,
					entry
				);

				if (error) {
					snackbar.pushError();
					return false;
				}

				updateEntriesStore(entry);

				if (oldEntry) {
					timeSheets.updateStats(entry.date, entry.timeSheetId, ({ count, hours, totalPrice }) => ({
						count,
						hours: hours - (oldEntry.hours - entry.hours),
						totalPrice:
							totalPrice -
							(oldEntry.pricePerHour * oldEntry.hours - entry.pricePerHour * entry.hours)
					}));
				}

				snackbar.pushSuccess('Pomyślnie zapisano.');
				return true;
			}
		}
	};
};
