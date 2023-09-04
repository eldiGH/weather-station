import { parseISO } from 'date-fns';

const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:Z)?$/;

function isIsoDateString(value: unknown): value is string {
	return Boolean(value && typeof value === 'string' && isoDateFormat.test(value));
}

export function parseObjectDates(body: Record<string, unknown>) {
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
}
