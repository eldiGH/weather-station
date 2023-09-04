import { parseObjectDates } from '$lib/helpers/date';
import config from '@config';
import urlJoin from 'url-join';

export type FetchFunc = (
	input: RequestInfo | URL,
	init?: RequestInit | undefined
) => Promise<Response>;

export type QueryParams = Record<string, number | string | Date | undefined>;

const parseQueryParams = (url: string, params?: QueryParams): string => {
	if (!params) {
		return url;
	}

	let paramsString = '';

	for (const key in params) {
		const value = params[key];

		if (value === undefined) {
			continue;
		}

		let parsedValue: string;

		if (typeof value === 'number') {
			parsedValue = value.toString();
		} else if (typeof value === 'string') {
			parsedValue = encodeURIComponent(value);
		} else {
			parsedValue = value.toISOString();
		}

		paramsString = `${paramsString}&${key}=${parsedValue}`;
	}

	return `${url}?${paramsString.substring(1)}`;
};

const parseBody = async (resp: Response) => {
	const body = await resp.json();
	parseObjectDates(body);
	return body;
};

export const getClient = (controllerUrl: string) => {
	const baseConfig: RequestInit = { headers: { 'Content-Type': 'application/json' } };

	const getConfig: RequestInit = { ...baseConfig, method: 'GET' };
	const postConfig: RequestInit = { ...baseConfig, method: 'POST' };

	return {
		get: (fetch: FetchFunc, url: string, params?: QueryParams) =>
			fetch(
				urlJoin(config.serverAddress, controllerUrl, parseQueryParams(url, params)),
				getConfig
			).then(parseBody),
		post: (fetch: FetchFunc, url: string, data: Record<string, unknown>, params?: QueryParams) =>
			fetch(urlJoin(config.serverAddress, controllerUrl, parseQueryParams(url, params)), {
				...postConfig,
				body: JSON.stringify(data)
			}).then(parseBody)
	};
};
