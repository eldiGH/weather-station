import { getKioskSensorData } from '$lib/api/kiosk';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch, params, parent }) => {
	const sensorId = parseInt(params.sensorId);
	if (isNaN(sensorId)) {
		throw Error('Sensor id is not a number');
	}

	const { kioskData } = await parent();

	const currentSensor = kioskData.sensors.find(({ id }) => id === sensorId);

	if (!currentSensor) {
		throw Error('Sensor not found');
	}

	return {
		sensor: {
			...currentSensor,
			data: await getKioskSensorData(fetch, params.kioskUuid, sensorId, { fromLastDays: 1 })
		}
	};
};
