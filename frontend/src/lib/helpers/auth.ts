import cookie from 'cookie';
import { fromUnixTime } from 'date-fns';
import { goto } from '$app/navigation';
import { jwt } from './jwt';
import { ACCESS_TOKEN_ADVANCE_TIME } from '$lib/constants';
import { handleTRCPErrors, trcp } from '$lib/api/trcp';
import type { LoginInput, RefreshInput, RegisterInput } from 'backend/schemas';
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
	const { data: tokens, error } = await handleTRCPErrors(trcp(fetch).auth.login.mutate, data);

	if (error) {
		return error;
	}

	saveTokens(tokens);
	goto('/', { replaceState: true });
};

export const register = async (data: RegisterInput) => {
	const { data: tokens, error } = await handleTRCPErrors(trcp(fetch).auth.register.mutate, data);

	if (error) {
		return error;
	}

	saveTokens(tokens);
	goto('/', { replaceState: true });
};

export const refresh = async (data: RefreshInput): Promise<ApiError | undefined> => {
	const { data: tokens, error } = await handleTRCPErrors(trcp(fetch).auth.refresh.mutate, data);

	if (error) {
		return error;
	}

	saveTokens(tokens);
};

export const logout = async (): Promise<void> => {
	const { refreshToken } = cookie.parse(document.cookie);

	handleTRCPErrors(trcp(fetch).auth.logout.mutate, { refreshToken });

	const unixTime = fromUnixTime(0);

	document.cookie = cookie.serialize('accessToken', '', { expires: unixTime });
	document.cookie = cookie.serialize('refreshToken', '', { expires: unixTime });

	goto('/login');
};
