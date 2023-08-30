import type { GetLatestBME68XDataEntryResponse } from 'shared';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const response = await fetch(`http://localhost:55556/sensors/bme68x/1`);

	return (await response.json()) as GetLatestBME68XDataEntryResponse;
};
