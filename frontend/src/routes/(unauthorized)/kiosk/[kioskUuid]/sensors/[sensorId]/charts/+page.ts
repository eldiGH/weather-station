import { getKioskSensorData } from '$lib/api/kiosk';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent, params }) => {
	const { sensor } = await parent();

	return {
		sensorData: await getKioskSensorData(fetch, params.kioskUuid, sensor.id, { fromLastDays: 1 })
	};
};
