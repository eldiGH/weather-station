import type { PageLoad } from './$types';
import type { GetLatestBME68XDataEntryResponse } from 'shared';
import type { ComponentProps } from 'svelte';
import type LineChart from '$lib/components/LineChart.svelte';
import { getBME68XData } from '$lib/api/sensors';

interface CurrentPageData extends ComponentProps<LineChart> {
	lastSensorEntry?: GetLatestBME68XDataEntryResponse;
}

type FetchType = (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>;

const getTemperatureData = async (fetch: FetchType): Promise<CurrentPageData> => {
	const data = await getBME68XData(fetch, 1, { fromLastDays: 1 });

	const xAxisData = data.map(({ createdAt }) => createdAt);
	const yAxisData = data.map(({ temperature }) => temperature);

	return { config: { label: 'Temperatura', xAxisData, yAxisData }, lastSensorEntry: data.at(-1) };
};

export const load: PageLoad = async ({ fetch }) => {
	return getTemperatureData(fetch);
};
