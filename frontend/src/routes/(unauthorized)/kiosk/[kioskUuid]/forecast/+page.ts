import { getKioskForecast } from '$lib/api/kiosk';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ fetch, params, depends }) => {
	depends('api:kioskForecast');
	return getKioskForecast(fetch, params.kioskUuid);
};
