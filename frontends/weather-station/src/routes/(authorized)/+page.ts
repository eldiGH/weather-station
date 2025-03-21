import type { PageLoad } from './$types';
import { trpcAuthed } from '../../../../shared/api/trpc';

type FetchType = (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>;

const getTemperatureData = async (fetch: FetchType) => {
	const { data, error } = await trpcAuthed(fetch).sensor.getSensorData.query({
		sensorId: 1,
		dateRangeQuery: { fromLastDays: 1 }
	});

	if (error) {
		throw error;
	}

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
