import type { GetBME68XDataResponse, GetSensorDataQuery } from 'shared';
import { getClient, type FetchFunc } from './client';

const sensorClient = getClient('sensors');

export const getBME68XData = async (
	fetch: FetchFunc,
	sensorId: number,
	dateRange?: GetSensorDataQuery
): Promise<GetBME68XDataResponse> =>
	await sensorClient.get(fetch, `/bme68x/${sensorId}`, { ...dateRange });
