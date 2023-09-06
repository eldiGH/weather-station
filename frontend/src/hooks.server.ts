import { redirect, type Handle, type HandleFetch, type RequestEvent } from '@sveltejs/kit';
import { HttpStatus } from 'shared';
import { fromUnixTime } from 'date-fns';
import { replaceHash } from '$lib/server/helpers/hashReplacer';
import { refreshRequest } from '$lib/api/auth';
import type { CookieSerializeOptions } from 'cookie';
import { jwt } from '$lib/helpers/jwt';
import { ACCESS_TOKEN_ADVANCE_TIME } from '$lib/constants';

const NOT_AUTHED_ROUTES = ['/login', '/register'];

export const handleFetch: HandleFetch = ({ fetch, event, request }) => {
	const accessToken = event.cookies.get('accessToken');

	if (!accessToken) {
		return fetch(request);
	}

	request.headers.set('Authorization', `Bearer ${accessToken}`);

	return fetch(request);
};

const refreshTokens = async (event: RequestEvent, refreshToken: string): Promise<void> => {
	const newTokens = await refreshRequest(event.fetch, { refreshToken });
	const decodedTokens = {
		access: jwt.decode(newTokens.accessToken),
		refresh: jwt.decode(newTokens.refreshToken)
	};

	const cookieOptions: CookieSerializeOptions = {
		sameSite: 'lax',
		secure: true,
		httpOnly: false
	};
	event.cookies.set('accessToken', newTokens.accessToken, {
		...cookieOptions,
		expires: fromUnixTime(decodedTokens.access.exp - ACCESS_TOKEN_ADVANCE_TIME)
	});
	event.cookies.set('refreshToken', newTokens.refreshToken, {
		...cookieOptions,
		expires: fromUnixTime(decodedTokens.refresh.exp)
	});
};

const checkIfAuthed = async (event: RequestEvent): Promise<boolean> => {
	const accessToken = event.cookies.get('accessToken');
	const refreshToken = event.cookies.get('refreshToken');

	if (!accessToken || !jwt.isValid(accessToken, { advanceTime: ACCESS_TOKEN_ADVANCE_TIME })) {
		if (!refreshToken) {
			return false;
		}

		const decodedRefreshToken = jwt.isValid(refreshToken);
		if (!decodedRefreshToken) {
			event.cookies.delete('accessToken');
			event.cookies.delete('refreshToken');
			return false;
		}

		await refreshTokens(event, refreshToken);
	}

	return true;
};

export const handle: Handle = async ({ event, resolve }) => {
	const isAuthed = await checkIfAuthed(event);
	const isOnAuthedRoute = !NOT_AUTHED_ROUTES.includes(event.url.pathname);

	if (isAuthed && !isOnAuthedRoute) {
		throw redirect(HttpStatus.FOUND, '/');
	} else if (!isAuthed && isOnAuthedRoute) {
		throw redirect(HttpStatus.FOUND, '/login');
	}

	const accessToken = event.cookies.get('accessToken');
	const headers = {
		Authorization: `Bearer ${accessToken}`,
		'Content-Type': 'application/json'
	};

	return resolve(event, {
		transformPageChunk: replaceHash(headers)
	});
};
