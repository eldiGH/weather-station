import { handleAuthedTRPCErrors, trpc } from '@shared/api/trpc';
import { CacheIdentifiers } from '$lib/constants/cache';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, depends }) => {
	depends(CacheIdentifiers.API_TIME_SHEETS_LIST);

	const { data: timeSheets, error } = await handleAuthedTRPCErrors(
		trpc(fetch).timeSheet.getTimeSheets.query,
		undefined
	);

	if (error) {
		throw error;
	}

	return {
		timeSheets
	};
};
