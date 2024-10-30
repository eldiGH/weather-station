import { trpc } from '@shared/ui/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent, params }) => {
	const { sensor } = await parent();

	const { data: sensorData, error } = await trpc(fetch).kiosk.getKioskSensorDetails.query({
		kioskUuid: params.kioskUuid,
		sensorId: sensor.id,
		dateRangeQuery: {
			fromLastDays: 1
		}
	});

	if (error) {
		throw error;
	}

	return {
		sensorData
	};
};
