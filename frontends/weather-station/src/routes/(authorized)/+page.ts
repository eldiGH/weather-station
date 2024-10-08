import type { PageLoad } from './$types';
import { trpc } from '../../../../shared/api/trpc';

type FetchType = (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>;

const getTemperatureData = async (fetch: FetchType) => {
	const data = await trpc(fetch).sensor.getSensorData.query({
		sensorId: 1,
		dateRangeQuery: { fromLastDays: 1 }
	}); //, 1, { fromLastDays: 1 });

	const xAxisData = data.map(({ createdAt }) => createdAt);
	const yAxisData = data.map(({ temperature }) => temperature);

	return {
		config: { xAxisData, datasets: [{ label: 'Temperatura', data: yAxisData }] },
		lastSensorEntry: data.at(-1)
	};
};

export const load: PageLoad = async ({ fetch }) => {
	return getTemperatureData(fetch);
};
