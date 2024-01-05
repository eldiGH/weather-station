import { trcp } from '$lib/api/trcp';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ fetch, params, depends }) => {
	depends('api:kioskForecast');
	return trcp(fetch).kiosk.getForecastForKiosk.query({ kioskUuid: params.kioskUuid });
};
