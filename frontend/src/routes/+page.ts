import type { GetBME68XDataResponse } from 'shared';
import type { PageLoad } from './$types';
import { subDays } from 'date-fns';

export const load: PageLoad = async ({ fetch }): Promise<{ dataSet: GetBME68XDataResponse }> => {
	const from = subDays(new Date(), 1);

	const response = await fetch(
		`http://localhost:55556/sensors/bme68x/1?from=${from.toISOString()}`
	);

	const data = (await response.json()) as GetBME68XDataResponse;

	return {
		dataSet: data.map((data) => ({
			...data,
			createdAt: new Date(data.createdAt as unknown as string)
		}))
	};
};
