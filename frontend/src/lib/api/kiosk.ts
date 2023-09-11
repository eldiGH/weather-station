import type {
	GetBME68XDataResponse,
	GetSensorDataQuery,
	KioskDataResponse,
	SensorResponseWithData
} from 'shared';
import { getClient, type FetchFunc } from './client';

const kioskClient = getClient('/kiosk');

export const getKioskData = (fetch: FetchFunc, kioskUuid: string): Promise<KioskDataResponse> =>
	kioskClient.get(fetch, `/${kioskUuid}`);

export const getKioskSensor = (
	fetch: FetchFunc,
	kioskUuid: string,
	sensorId: number,
	dateRange?: GetSensorDataQuery
): Promise<SensorResponseWithData> =>
	kioskClient.get(fetch, `/${kioskUuid}/${sensorId}`, dateRange);

export const getKioskSensorData = (
	fetch: FetchFunc,
	kioskUuid: string,
	sensorId: number,
	dateRange?: GetSensorDataQuery
): Promise<GetBME68XDataResponse> =>
	kioskClient.get(fetch, `/${kioskUuid}/${sensorId}/data`, dateRange);
