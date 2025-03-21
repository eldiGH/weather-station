import * as cookie from 'cookie';
import { fromUnixTime, isFuture, isValid, subMilliseconds } from 'date-fns';
import { goto } from '$app/navigation';
import { trpc } from '../api/trpc';
import type { LoginInput, RegisterInput } from 'backend/schemas';
import type { ApiError } from 'backend/types';
import { isDevelopment } from './environment';
import { jwtDecode } from 'jwt-decode';
import type { CookieTokensData, TokensData } from '../types/Token';

const saveToken = (tokens: TokensData) => {
	const baseCookieConfig: cookie.SerializeOptions = {
		sameSite: 'lax',
		secure: !isDevelopment,
		path: '/'
	};

	const { accessToken, refreshTokenExpiry } = tokens;

	document.cookie = cookie.serialize('accessToken', accessToken.token, {
		...baseCookieConfig,
		expires: accessToken.expires
	});
	document.cookie = cookie.serialize('refreshTokenExpiry', refreshTokenExpiry.toISOString(), {
		...baseCookieConfig,
		expires: refreshTokenExpiry
	});
};

export const login = async (data: LoginInput) => {
	const { data: accessToken, error } = await trpc(fetch).auth.login.mutate(data);

	if (error) {
		return error;
	}

	saveToken(accessToken);
	goto('/', { replaceState: true });
};

export const register = async (data: RegisterInput) => {
	const { error, data: tokens } = await trpc(fetch).auth.register.mutate(data);

	if (error) {
		return error;
	}

	saveToken(tokens);
	goto('/', { replaceState: true });
};

export const refresh = async (): Promise<ApiError | undefined> => {
	const { error, data } = await trpc(fetch).auth.refresh.mutate();

	if (error) {
		return error;
	}

	saveToken(data);
};

export const logout = async (): Promise<void> => {
	await trpc(fetch).auth.logout.mutate();

	const unixTime = fromUnixTime(0);

	document.cookie = cookie.serialize('accessToken', '', { expires: unixTime });
	document.cookie = cookie.serialize('refreshTokenExpiry', '', { expires: unixTime });

	goto('/login', { replaceState: true });
};

export const getTokensDataCookies = () => {
	const { accessToken, refreshTokenExpiry } = cookie.parse(document.cookie) as {
		accessToken?: string;
		refreshTokenExpiry?: string;
	};

	let refreshTokenExpiryDate;
	if (refreshTokenExpiry) {
		const date = new Date(refreshTokenExpiry);
		refreshTokenExpiryDate = isValid(date) ? date : undefined;
	}

	return { accessToken, refreshTokenExpiry: refreshTokenExpiryDate };
};

export const isLoggedIn = (data: CookieTokensData) => {
	const { refreshTokenExpiry } = data;

	return refreshTokenExpiry !== undefined && isFuture(refreshTokenExpiry);
};

const ACCESS_TOKEN_INVALIDATE_ADVANCE_TIME_MS = 10000;

export const hasValidAccessToken = (data: CookieTokensData) => {
	const { accessToken } = data;

	if (!(accessToken && accessToken.length > 0)) {
		return false;
	}

	try {
		const decodedToken = jwtDecode(accessToken);

		if (!decodedToken.exp) {
			return false;
		}
		const expDate = new Date(decodedToken.exp * 1000);

		if (!isFuture(subMilliseconds(expDate, ACCESS_TOKEN_INVALIDATE_ADVANCE_TIME_MS))) {
			return false;
		}

		return true;
	} catch (_) {
		return false;
	}
};
