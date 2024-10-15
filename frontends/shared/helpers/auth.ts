import * as cookie from 'cookie';
import { fromUnixTime } from 'date-fns';
import { goto } from '$app/navigation';
import { handleTRCPErrors, trpc } from '../api/trpc';
import type { LoginInput, RegisterInput } from 'backend/schemas';
import type { ApiError } from 'backend/types';
import { isDevelopment } from './environment';

const saveToken = (accessToken: { token: string; expires: Date }) => {
	const baseCookieConfig: cookie.SerializeOptions = {
		sameSite: 'lax',
		secure: !isDevelopment
	};

	const { token, expires } = accessToken;

	document.cookie = cookie.serialize('accessToken', token, {
		...baseCookieConfig,
		expires
	});
};

export const login = async (data: LoginInput) => {
	const { data: accessToken, error } = await handleTRCPErrors(trpc(fetch).auth.login.mutate, data);

	if (error) {
		return error;
	}

	saveToken(accessToken);
	goto('/', { replaceState: true });
};

export const register = async (data: RegisterInput) => {
	const { error, data: accessToken } = await handleTRCPErrors(
		trpc(fetch).auth.register.mutate,
		data
	);

	if (error) {
		return error;
	}

	saveToken(accessToken);
	goto('/', { replaceState: true });
};

export const refresh = async (): Promise<ApiError | undefined> => {
	const { error, data: accessToken } = await handleTRCPErrors(
		trpc(fetch).auth.refresh.mutate,
		undefined
	);

	if (error) {
		return error;
	}

	saveToken(accessToken);
};

export const logout = async (): Promise<void> => {
	handleTRCPErrors(trpc(fetch).auth.logout.mutate, undefined);

	const unixTime = fromUnixTime(0);

	document.cookie = cookie.serialize('accessToken', '', { expires: unixTime });

	goto('/login', { replaceState: true });
};

export const isLoggedIn = () => {
	const { accessToken } = cookie.parse(document.cookie);

	return Boolean(accessToken);
};
