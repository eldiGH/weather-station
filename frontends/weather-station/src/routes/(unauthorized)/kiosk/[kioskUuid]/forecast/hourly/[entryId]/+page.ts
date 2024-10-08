import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params }) => {
	const { hourly } = await parent();

	const currentHour = hourly[parseInt(params.entryId)];

	if (!currentHour) {
		throw Error('Hour entry not found');
	}

	return { currentHour };
};
