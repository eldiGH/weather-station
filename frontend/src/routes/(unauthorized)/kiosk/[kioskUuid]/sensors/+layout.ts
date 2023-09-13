import { getKioskData } from '$lib/api/kiosk';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ fetch, params, depends }) => {
	depends('api:kioskData');

	return {
		kioskData: getKioskData(fetch, params.kioskUuid)
	};
};
