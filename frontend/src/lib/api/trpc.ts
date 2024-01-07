import config from '@config';
import {
	TRPCClientError,
	createTRPCProxyClient,
	createWSClient,
	httpBatchLink,
	loggerLink,
	wsLink,
	type CreateTRPCProxyClient
} from '@trpc/client';
import { transformer, type AppRouter } from 'backend/trpc';
import { isApiError } from '../../../../backend/src/types/ApiError';
import type { ApiError } from 'backend/types';
import { isDevelopment } from '$lib/helpers/environment';
import { browser } from '$app/environment';

export type FetchFunc = (
	input: RequestInfo | URL,
	init?: RequestInit | undefined
) => Promise<Response>;

export const isTrpcClientError = (error: unknown): error is TRPCClientError<AppRouter> =>
	error instanceof TRPCClientError;

const logger = loggerLink({ enabled: () => isDevelopment });

export const trpc = (fetch: FetchFunc) =>
	createTRPCProxyClient<AppRouter>({
		links: [logger, httpBatchLink({ url: config.serverAddress, fetch })],
		transformer
	});

let trpcWsClient: CreateTRPCProxyClient<AppRouter> | null = null;
export const trpcWs = () => {
	if (!browser) {
		throw new Error(
			'TRPC ws client used outside of browser! Use normal http client on server, as it handles cache'
		);
	}

	if (!trpcWsClient) {
		const wsClient = createWSClient({
			url: config.serverAddress.replace('http', 'ws') //'ws://localhost:3000/trpc'
		});

		trpcWsClient = createTRPCProxyClient({
			links: [logger, wsLink<AppRouter>({ client: wsClient })],
			transformer
		}) as unknown as CreateTRPCProxyClient<AppRouter>;
	}

	return trpcWsClient;
};

type HandledError<Data> =
	| { success: true; data: Data; error: null }
	| { success: false; error: ApiError; data: null };

export const handleTRCPErrors = async <T, O, D>(
	procedure: (input: T, opts?: O) => Promise<D>,
	input: T,
	opts?: O
): Promise<HandledError<D>> => {
	try {
		return { success: true, data: await procedure(input, opts), error: null };
	} catch (error) {
		if (!(isTrpcClientError(error) && isApiError(error.data))) {
			throw error;
		}

		return { success: false, error: error.data, data: null };
	}
};
