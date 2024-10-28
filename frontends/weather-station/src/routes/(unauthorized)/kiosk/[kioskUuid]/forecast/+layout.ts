import { trpc } from '@shared/ui/api';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch, params, depends }) => {
	depends('api:kioskForecast');
	const { error, data } = await trpc(fetch).kiosk.getForecastForKiosk.query({
		kioskUuid: params.kioskUuid
	});

	if (error) {
		throw error;
	}

	return data;
};
