import { trpc } from '@shared/api/trpc';
import { CacheIdentifiers } from '$lib/constants/cache';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, depends }) => {
	depends(CacheIdentifiers.API_TIME_SHEETS_LIST);

	return {
		timeSheets: await trpc(fetch).timeSheet.getTimeSheets.query()
	};
};
