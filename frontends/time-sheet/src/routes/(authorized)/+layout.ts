import { handleAuthedTRPCErrors, trpc } from '@shared/ui/api';
import { CacheIdentifiers } from '$lib/constants/cache';
import type { LayoutLoad } from './$types';
import { writable } from 'svelte/store';
import type { AddTimeSheetInput, EditTimeSheetInput } from 'backend/schemas';
import { snackbar } from '@shared/ui/helpers';
import { ApiErrorCode } from 'backend/types';
import type { AppRouterOutputs } from 'backend/trpc';
import { addMonths, isSameMonth, subMonths } from 'date-fns';

type TimeSheetEntry = AppRouterOutputs['timeSheet']['getTimeSheetForMonth'][number];
type TimeSheetStats = AppRouterOutputs['timeSheet']['getTimeSheets'][number]['currentMonth'];

const getStatsOfTimeSheet = (entries: TimeSheetEntry[]) =>
	entries
		.filter((e) => e.hours > 0)
		.reduce(
			(acc, e) => ({
				totalPrice: acc.totalPrice + e.pricePerHour * e.hours,
				hours: acc.hours + e.hours,
				count: acc.count + 1
			}),
			{ totalPrice: 0, hours: 0, count: 0 }
		);

export const load: LayoutLoad = async ({ fetch, depends }) => {
	depends(CacheIdentifiers.API_TIME_SHEETS_LIST);

	const { data, error } = await handleAuthedTRPCErrors(
		trpc(fetch).timeSheet.getTimeSheets.query,
		undefined
	);

	if (error) {
		throw error;
	}

	const timeSheets = writable(data);

	return {
		timeSheets: {
			subscribe: timeSheets.subscribe,
			delete: async (timeSheetId: string) => {
				const { error } = await handleAuthedTRPCErrors(
					trpc(fetch).timeSheet.deleteTimeSheet.mutate,
					{
						timeSheetId
					}
				);

				if (error) {
					snackbar.pushError();
					return false;
				}

				timeSheets.update((t) => t.filter((timeSheet) => timeSheet.id !== timeSheetId));
				snackbar.pushSuccess('Pomyślnie usunięto');
				return true;
			},
			add: async (input: AddTimeSheetInput) => {
				const { error, data } = await handleAuthedTRPCErrors(
					trpc(fetch).timeSheet.createTimeSheet.mutate,
					input
				);

				if (error) {
					snackbar.pushError();
					return false;
				}

				const newTimeSheet = {
					...data,
					currentMonth: { count: 0, hours: 0, totalPrice: 0 },
					lastMonth: { count: 0, hours: 0, totalPrice: 0 }
				};

				timeSheets.update((t) => [...t, newTimeSheet]);
				snackbar.pushSuccess('Pomyślnie dodano.');
				return true;
			},
			edit: async (input: EditTimeSheetInput) => {
				const { error } = await handleAuthedTRPCErrors(
					trpc(fetch).timeSheet.editTimeSheet.mutate,
					input
				);

				if (error) {
					if (error.errorCode === ApiErrorCode.TIME_SHEET_NAME_ALREADY_USED) {
						return error;
					}

					snackbar.pushError();
					return false;
				}

				snackbar.pushSuccess('Pomyślnie zapisano.');

				timeSheets.update((t) => [
					...t.map((timeSheet) =>
						timeSheet.id !== input.timeSheetId
							? timeSheet
							: {
									...timeSheet,
									name: input.name,
									defaultHours: input.defaultHours ?? null,
									defaultPricePerHour: input.defaultPricePerHour ?? null
								}
					)
				]);

				return true;
			},

			recalculateStats: (date: string | Date, timeSheetId: string, entries: TimeSheetEntry[]) => {
				const currentDate = new Date();

				if (isSameMonth(currentDate, date)) {
					timeSheets.update((t) =>
						t.map((timeSheet) =>
							timeSheet.id === timeSheetId
								? {
										...timeSheet,
										currentMonth: getStatsOfTimeSheet(entries)
									}
								: timeSheet
						)
					);
				} else if (isSameMonth(currentDate, addMonths(date, 1))) {
					timeSheets.update((t) =>
						t.map((timeSheet) =>
							timeSheet.id === timeSheetId
								? {
										...timeSheet,
										lastMonth: getStatsOfTimeSheet(entries)
									}
								: timeSheet
						)
					);
				}
			},

			updateStats: (
				date: string,
				timeSheetId: string,
				newStats: (currentStats: TimeSheetStats) => TimeSheetStats
			) => {
				timeSheets.update((timeSheets) => {
					const currentDate = new Date();
					const isCurrentMonth = isSameMonth(date, currentDate);
					const isLastMonth = isSameMonth(date, subMonths(currentDate, 1));

					if (isCurrentMonth) {
						return timeSheets.map((t) =>
							t.id === timeSheetId ? { ...t, currentMonth: newStats(t.currentMonth) } : t
						);
					} else if (isLastMonth) {
						return timeSheets.map((t) =>
							t.id === timeSheetId ? { ...t, lastMonth: newStats(t.lastMonth) } : t
						);
					}

					return timeSheets;
				});
			}
		}
	};
};
