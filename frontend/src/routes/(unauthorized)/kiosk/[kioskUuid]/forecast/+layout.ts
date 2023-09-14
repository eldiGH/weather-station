import { getKioskForecast } from '$lib/api/kiosk';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ fetch, params, depends }) => {
	depends('api:kioskForecast');
	return getKioskForecast(fetch, params.kioskUuid);
};
