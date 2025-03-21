import { get } from 'svelte/store';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params, parent }) => {
	const sensorId = parseInt(params.sensorId);
	if (isNaN(sensorId)) {
		throw Error('Sensor id is not a number');
	}

	const { kioskDataStore } = await parent();

	const currentSensor = get(kioskDataStore).sensors.find(({ id }) => id === sensorId);

	if (!currentSensor) {
		throw Error('Sensor not found');
	}

	return {
		sensor: currentSensor
	};
};
