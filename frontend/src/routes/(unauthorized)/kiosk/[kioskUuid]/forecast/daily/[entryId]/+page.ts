import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params }) => {
	const { daily } = await parent();

	const currentDay = daily[parseInt(params.entryId)];

	if (!currentDay) {
		throw Error('Hour entry not found');
	}

	return { currentDay };
};
