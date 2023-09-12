import { getKioskForecast } from '$lib/api/kiosk';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ fetch, params }) => getKioskForecast(fetch, params.kioskUuid);
