import { trcp } from '$lib/api/trcp';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch, params, depends }) => {
	depends('api:kioskData');

	return {
		kioskData: await trcp(fetch).kiosk.getKioskData.query({ kioskUuid: params.kioskUuid })
	};
};
