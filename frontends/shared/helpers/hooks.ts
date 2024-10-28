import { redirect, type Handle, type RequestEvent } from '@sveltejs/kit';
import { ACCESS_TOKEN_ADVANCE_TIME } from '../constants';
import urljoin from 'url-join';
import config from '../config.json';
import { jwt } from '../helpers/jwt';
import { HttpStatus } from 'backend/types';
import { parse } from 'devalue';
import { isDevelopment } from './environment';
import type { SerializeOptions } from 'cookie';
import type { TokensData } from '../types/Token';

const NOT_AUTHED_ROUTES = ['/login', '/register', '/kiosk'];
const AUTHED_NOT_ALLOWED_ROUTES = ['/login', '/register'];

const parseCookieOptions = (
	setCookieString: string
): [string, string, SerializeOptions & { path: string }] => {
	const splitted = setCookieString.split(';');

	const [name, value] = splitted.shift()?.split('=') ?? [];

	const options: SerializeOptions & { path: string } = { path: '/', secure: !isDevelopment };

	for (const property of splitted) {
		const trimmedProp = property.trim();

		switch (trimmedProp) {
			case 'HttpOnly': {
				options.httpOnly = true;
				continue;
			}
			case 'Secure': {
				options.secure = true;
				continue;
			}
		}

		const [key, val] = trimmedProp.split('=');

		switch (key) {
			case 'Expires': {
				options.expires = new Date(val);
				continue;
			}
			case 'Path': {
				options.path = val;
				continue;
			}
			case 'SameSite': {
				options.sameSite = val as SerializeOptions['sameSite'];
				continue;
			}
		}
	}

	return [name, value, options];
};

const refreshTokens = async (
	{ fetch, cookies }: RequestEvent,
	refreshToken: string
): Promise<boolean> => {
	try {
		const resp = await fetch(urljoin(config.serverAddress, '/auth.refresh'), {
			headers: { cookie: `refreshToken=${refreshToken}`, 'Content-Type': 'application/json' },
			method: 'POST'
		});

		for (const setCookieString of resp.headers.getSetCookie()) {
			cookies.set(...parseCookieOptions(setCookieString));
		}

		const jsonResp = await resp.json();

		if (jsonResp.error) {
			throw jsonResp.error;
		}

		const tokens: TokensData = parse(jsonResp.data);

		const cookieOptions = {
			sameSite: 'lax',
			secure: !isDevelopment,
			httpOnly: false,
			path: '/'
		} satisfies SerializeOptions;

		cookies.set('accessToken', tokens.accessToken.token, {
			...cookieOptions,
			expires: tokens.accessToken.expires
		});
		cookies.set('refreshTokenExpiry', tokens.refreshTokenExpiry.toISOString(), {
			...cookieOptions,
			expires: tokens.refreshTokenExpiry
		});
		return true;
	} catch (_) {
		return false;
	}
};

const checkIfAuthed = async (event: RequestEvent): Promise<boolean> => {
	const accessToken = event.cookies.get('accessToken');
	const refreshToken = event.cookies.get('refreshToken');

	if (!accessToken || !jwt.isValid(accessToken, { advanceTime: ACCESS_TOKEN_ADVANCE_TIME })) {
		if (!refreshToken) {
			event.cookies.delete('accessToken', { path: '/' });
			return false;
		}

		return await refreshTokens(event, refreshToken);
	}

	return true;
};

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/trpc')) {
		const pathname = event.url.pathname.replace(/\/trpc(?:ws)?\//, '');
		const url = `${urljoin(config.serverAddress, pathname)}${event.url.search}`;

		return event.fetch(url, {
			body: event.request.body,
			headers: event.request.headers,
			method: event.request.method
		});
	}

	const isAuthed = await checkIfAuthed(event);
	const isOnAuthedRoute = !NOT_AUTHED_ROUTES.some((notAuthedRoute) =>
		event.url.pathname.startsWith(notAuthedRoute)
	);
	const isOnNotAllowedAuthedRoute = AUTHED_NOT_ALLOWED_ROUTES.some((authedNotAllowedRoute) =>
		event.url.pathname.startsWith(authedNotAllowedRoute)
	);

	if (isAuthed && isOnNotAllowedAuthedRoute) {
		throw redirect(HttpStatus.FOUND, '/');
	} else if (!isAuthed && isOnAuthedRoute) {
		throw redirect(HttpStatus.FOUND, '/login');
	}

	return resolve(event);
};
