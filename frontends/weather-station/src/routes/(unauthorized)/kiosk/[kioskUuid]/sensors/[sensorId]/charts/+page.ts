import { trpc } from '../../../../../../../../../shared/api/trpc';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent, params }) => {
	const { sensor } = await parent();

	return {
		sensorData: await trpc(fetch).kiosk.getKioskSensorDetails.query({
			kioskUuid: params.kioskUuid,
			sensorId: sensor.id,
			dateRangeQuery: {
				fromLastDays: 1
			}
		})
	};
};
