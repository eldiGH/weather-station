import { trpc } from '@shared/api/trpc';
import type { PageLoad } from './$types';
import { getMonthsBoundaries } from 'backend/helpers';

export const load: PageLoad = async ({ fetch, params }) => {
	const timeSheet = await trpc(fetch).timeSheet.getTimeSheet.query({
		id: params.timeSheetId,
		dates: getMonthsBoundaries(new Date())
	});

	return { timeSheet };
};
