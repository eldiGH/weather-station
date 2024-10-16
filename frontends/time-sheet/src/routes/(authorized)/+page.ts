import { handleAuthedTRPCErrors, trpc } from '@shared/api/trpc';
import { CacheIdentifiers } from '$lib/constants/cache';
import type { PageLoad } from './$types';
import { writable } from 'svelte/store';
import { snackbar } from '@shared/components/SnackbarProvider.svelte';

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
				return true;
			}
		}
	};
};
