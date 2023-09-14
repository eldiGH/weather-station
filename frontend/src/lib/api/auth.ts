import type {
	LoginRequest,
	LoginResponse,
	LogoutRequest,
	RefreshRequest,
	RefreshResponse,
	RegisterRequest,
	RegisterResponse
} from 'shared';
import { getClient, type FetchFunc } from './client';

const authClient = getClient('/auth');

export const loginRequest = (fetch: FetchFunc, data: LoginRequest): Promise<LoginResponse> =>
	authClient.post(fetch, '/login', { data });

export const registerRequest = (
	fetch: FetchFunc,
	data: RegisterRequest
): Promise<RegisterResponse> => authClient.post(fetch, '/register', { data });

export const refreshRequest = (fetch: FetchFunc, data: RefreshRequest): Promise<RefreshResponse> =>
	authClient.post(fetch, '/refresh', { data, authed: true });

export const logoutRequest = (fetch: FetchFunc, data: LogoutRequest): Promise<void> =>
	authClient.post(fetch, '/logout', { data, authed: true });
