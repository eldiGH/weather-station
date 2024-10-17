import { handleAuthedTRPCErrors, trpc } from '@shared/api/trpc';
import { CacheIdentifiers } from '$lib/constants/cache';
import type { PageLoad } from './$types';
import { writable } from 'svelte/store';
import type { CreateTimeSheetInput, EditTimeSheetInput } from 'backend/schemas';
import { snackbar } from '@shared/helpers/snackbar';
import { ApiErrorCode } from 'backend/types';

export const load: PageLoad = async ({ fetch, depends }) => {
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
			add: async (input: CreateTimeSheetInput) => {
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
				snackbar.pushSuccess('Pomyślnie dodano');
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
			}
		}
	};
};
