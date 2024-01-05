import { trcp } from '$lib/api/trcp';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent, params }) => {
	const { sensor } = await parent();

	return {
		sensorData: await trcp(fetch).kiosk.getKioskSensorDetails.query({
			kioskUuid: params.kioskUuid,
			sensorId: sensor.id,
			dateRangeQuery: {
				fromLastDays: 1
			}
		})
	};
};
