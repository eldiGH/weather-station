import { trpc } from '$lib/api/trpc';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch, params, depends }) => {
	depends('api:kioskData');

	return {
		kioskData: await trpc(fetch).kiosk.getKioskData.query({ kioskUuid: params.kioskUuid }),
		kioskUuid: params.kioskUuid
	};
};
