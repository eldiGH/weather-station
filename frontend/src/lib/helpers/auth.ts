import cookie from 'cookie';
import { fromUnixTime } from 'date-fns';
import { goto } from '$app/navigation';
import { jwt } from './jwt';
import { ACCESS_TOKEN_ADVANCE_TIME } from '$lib/constants';
import { handleTRCPErrors, trpc } from '$lib/api/trpc';
import type { LoginInput, RegisterInput } from 'backend/schemas';
import type { ApiError } from 'backend/types';

interface Tokens {
	accessToken: string;
	refreshToken: string;
}

const saveTokens = ({ accessToken, refreshToken }: Tokens) => {
	const decodedAccessToken = jwt.decode(accessToken);
	const decodedRefreshToken = jwt.decode(refreshToken);

	const accessTokenExpDate = fromUnixTime(decodedAccessToken.exp - ACCESS_TOKEN_ADVANCE_TIME);
	const refreshTokenExpDate = fromUnixTime(decodedRefreshToken.exp);

	const baseCookieConfig: cookie.CookieSerializeOptions = { sameSite: 'lax', secure: true };

	document.cookie = cookie.serialize('accessToken', accessToken, {
		...baseCookieConfig,
		expires: accessTokenExpDate
	});
	document.cookie = cookie.serialize('refreshToken', refreshToken, {
		...baseCookieConfig,
		expires: refreshTokenExpDate
	});
};

export const login = async (data: LoginInput) => {
	const { data: accessToken, error } = await handleTRCPErrors(trpc(fetch).auth.login.mutate, data);

	if (error) {
		return error;
	}

	saveTokens(tokens);
	goto('/', { replaceState: true });
};

export const register = async (data: RegisterInput) => {
	const { data: tokens, error } = await handleTRCPErrors(trpc(fetch).auth.register.mutate, data);

	if (error) {
		return error;
	}

	saveTokens(tokens);
	goto('/', { replaceState: true });
};

export const refresh = async (): Promise<ApiError | undefined> => {
	const { data: tokens, error } = await handleTRCPErrors(
		trpc(fetch).auth.refresh.mutate,
		undefined
	);

	if (error) {
		return error;
	}

	saveTokens(tokens);
};

export const logout = async (): Promise<void> => {
	handleTRCPErrors(trpc(fetch).auth.logout.mutate, undefined);

	const unixTime = fromUnixTime(0);

	document.cookie = cookie.serialize('accessToken', '', { expires: unixTime });
	document.cookie = cookie.serialize('refreshToken', '', { expires: unixTime });

	goto('/login');
};
