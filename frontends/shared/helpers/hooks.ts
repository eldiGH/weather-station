import { redirect, type Handle, type RequestEvent } from '@sveltejs/kit';
import { ACCESS_TOKEN_ADVANCE_TIME } from '../constants';
import urljoin from 'url-join';
import config from '../config.json';
import { jwt } from '../helpers/jwt';
import { HttpStatus } from 'backend/types';
import { parse } from 'devalue';
import type { CookieSerializeOptions } from 'cookie';
import { isDevelopment } from './environment';

const NOT_AUTHED_ROUTES = ['/login', '/register', '/kiosk'];
const AUTHED_NOT_ALLOWED_ROUTES = ['/login', '/register'];

const parseCookieOptions = (
	setCookieString: string
): [string, string, CookieSerializeOptions & { path: string }] => {
	const splitted = setCookieString.split(';');

	const [name, value] = splitted.shift()?.split('=') ?? [];

	const options: CookieSerializeOptions & { path: string } = { path: '/' };

	for (const property of splitted) {
		const trimmedProp = property.trim();

		switch (trimmedProp) {
			case 'HttpOnly': {
				options.httpOnly = true;
				continue;
			}
			case 'Secure': {
				options.secure = !isDevelopment;
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
				options.sameSite = val as CookieSerializeOptions['sameSite'];
				continue;
			}
		}
	}

	return [name, value, options];
};

const refreshTokens = async (event: RequestEvent, refreshToken: string): Promise<boolean> => {
	try {
		const resp = await event.fetch(urljoin(config.serverAddress, '/auth.refresh'), {
			headers: { cookie: `refreshToken=${refreshToken}`, 'Content-Type': 'application/json' },
			method: 'POST'
		});

		if (!resp.ok) {
			return false;
		}

		for (const setCookieString of resp.headers.getSetCookie()) {
			event.cookies.set(...parseCookieOptions(setCookieString));
		}

		const accessToken: { token: string; expires: Date } = parse((await resp.json()).result.data);

		const cookieOptions = {
			sameSite: 'lax',
			secure: !isDevelopment,
			httpOnly: false,
			path: '/',
			expires: accessToken.expires
		} satisfies CookieSerializeOptions;

		event.cookies.set('accessToken', accessToken.token, cookieOptions);
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
