import { parseObjectDates } from '$lib/helpers/date';
import { ApiError } from '$lib/types/ApiError';
import config from '@config';
import urlJoin from 'url-join';
import { browser } from '$app/environment';
import cookie from 'cookie';

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
	const textBody = await resp.text();

	if (textBody.length === 0) {
		if (!resp.ok) {
			throw new Error('Unexpected error');
		}

		return {};
	}

	const body = JSON.parse(textBody);

	if (!resp.ok) {
		throw new ApiError(body);
	}

	parseObjectDates(body);
	return body;
};

const handleClientAuth = () => {
	if (browser) {
		const cookies = cookie.parse(document.cookie);

		if (!cookies.accessToken) {
			return;
		}

		return { Authorization: `Bearer ${cookies.accessToken}` };
	}
};

export const getClient = (controllerUrl: string) => {
	const baseConfig = (): RequestInit => ({
		headers: { 'Content-Type': 'application/json', ...handleClientAuth() }
	});

	const getConfig = (): RequestInit => ({ ...baseConfig(), method: 'GET' });
	const postConfig = (data: Record<string, unknown>): RequestInit => ({
		...baseConfig(),
		method: 'POST',
		body: JSON.stringify(data)
	});

	return {
		get: (fetch: FetchFunc, url: string, params?: QueryParams) =>
			fetch(
				urlJoin(config.serverAddress, controllerUrl, parseQueryParams(url, params)),
				getConfig()
			).then(parseBody),
		post: (fetch: FetchFunc, url: string, data: Record<string, unknown>, params?: QueryParams) =>
			fetch(
				urlJoin(config.serverAddress, controllerUrl, parseQueryParams(url, params)),
				postConfig(data)
			).then(parseBody)
	};
};

type HandleApiErrorResult<R> =
	| {
			data: R;
			error?: undefined;
	  }
	| {
			data?: undefined;
			error: ApiError;
	  };

export const handleApiError = async <T extends unknown[], R>(
	requestFunction: (...args: T) => Promise<R>,
	...args: T
): Promise<HandleApiErrorResult<R>> => {
	try {
		const data = await requestFunction(...args);

		return { data };
	} catch (error) {
		if (error instanceof ApiError) {
			return { error };
		}

		throw error;
	}
};
