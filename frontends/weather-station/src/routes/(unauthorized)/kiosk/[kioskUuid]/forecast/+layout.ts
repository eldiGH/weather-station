import { trpc } from '@shared/ui/api';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ fetch, params, depends }) => {
	depends('api:kioskForecast');
	return trpc(fetch).kiosk.getForecastForKiosk.query({ kioskUuid: params.kioskUuid });
};
