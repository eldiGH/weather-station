import { trpc } from '@shared/api/trpc';
import type { LayoutLoad } from './$types';
import { CacheIdentifiers } from '$lib/constants/cache';

export const load: LayoutLoad = async ({ fetch, depends }) => {
	depends(CacheIdentifiers.API_TIME_SHEETS_LIST);

	return {
		timeSheets: await trpc(fetch).timeSheet.getTimeSheets.query()
	};
};
