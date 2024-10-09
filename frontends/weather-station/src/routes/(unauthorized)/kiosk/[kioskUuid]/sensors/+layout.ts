import { trpc } from '@shared/api/trpc';
import { writable } from 'svelte/store';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch, params }) => {
	return {
		kioskDataStore: writable(
			await trpc(fetch).kiosk.getKioskData.query({ kioskUuid: params.kioskUuid })
		),
		kioskUuid: params.kioskUuid
	};
};
