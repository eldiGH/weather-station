import { trpc } from '@shared/api/trpc';
import type { PageLoad } from './$types';
import { addMonths, format, set, subDays } from 'date-fns';

export const load: PageLoad = async ({ fetch, params }) => {
	const fromDate = set(new Date(), { date: 1 });
	const toDate = subDays(addMonths(fromDate, 1), 1);

	const timeSheet = await trpc(fetch).timeSheet.getTimeSheet.query({
		id: params.timeSheetId,
		dates: {
			from: format(fromDate, 'yyyy-MM-dd'),
			to: format(toDate, 'yyyy-MM-dd')
		}
	});

	return { timeSheet };
};
