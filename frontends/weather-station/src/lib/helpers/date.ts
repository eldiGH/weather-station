import { format, isBefore, parseISO, subDays } from 'date-fns';

const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:Z)?$/;

const isIsoDateString = (value: unknown): value is string => {
	return Boolean(value && typeof value === 'string' && isoDateFormat.test(value));
};

export const parseObjectDates = (body: Record<string, unknown>) => {
	if (body === null || body === undefined || typeof body !== 'object') {
		return body;
	}

	for (const key of Object.keys(body)) {
		const value = body[key];
		if (isIsoDateString(value)) {
			body[key] = parseISO(value);
		} else if (value !== null && typeof value === 'object') {
			parseObjectDates(value as Record<string, unknown>);
		}
	}
};

export const formatCreatedAt = (date: Date): string =>
	isBefore(date, subDays(new Date(), 1))
		? format(date, "HH:mm dd.MM.yyyy'r.'")
		: format(date, 'HH:mm');
