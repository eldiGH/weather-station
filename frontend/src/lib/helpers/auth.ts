import { loginRequest, logoutRequest, refreshRequest, registerRequest } from '$lib/api/auth';
import { handleApiError } from '$lib/api/client';
import type { ApiError } from '$lib/types/ApiError';
import type { LoginRequest, LogoutRequest, RefreshRequest, RegisterRequest } from 'shared';
import cookie from 'cookie';
import { fromUnixTime } from 'date-fns';
import { goto } from '$app/navigation';
import { jwt } from './jwt';
import { ACCESS_TOKEN_ADVANCE_TIME } from '$lib/constants';

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

export const login = async (data: LoginRequest): Promise<ApiError | undefined> => {
	const { data: tokens, error } = await handleApiError(loginRequest, fetch, data);

	if (error) {
		return error;
	}

	saveTokens(tokens);
	goto('/', { replaceState: true });
};

export const register = async (data: RegisterRequest): Promise<ApiError | undefined> => {
	const { data: tokens, error } = await handleApiError(registerRequest, fetch, data);

	if (error) {
		return error;
	}

	saveTokens(tokens);
	goto('/', { replaceState: true });
};

export const refresh = async (data: RefreshRequest): Promise<ApiError | undefined> => {
	const { data: tokens, error } = await handleApiError(refreshRequest, fetch, data);

	if (error) {
		return error;
	}

	saveTokens(tokens);
};

export const logout = async (): Promise<void> => {
	const { refreshToken } = cookie.parse(document.cookie);

	handleApiError(logoutRequest, fetch, { refreshToken });

	const unixTime = fromUnixTime(0);

	document.cookie = cookie.serialize('accessToken', '', { expires: unixTime });
	document.cookie = cookie.serialize('refreshToken', '', { expires: unixTime });

	goto('/login');
};
