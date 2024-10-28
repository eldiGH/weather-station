import { trpc } from '@shared/ui/api';
import { writable } from 'svelte/store';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch, params }) => {
	const { error, data } = await trpc(fetch).kiosk.getKioskData.query({
		kioskUuid: params.kioskUuid
	});
	if (error) {
		throw error;
	}

	return {
		kioskDataStore: writable(data),
		kioskUuid: params.kioskUuid
	};
};
