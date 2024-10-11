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
import { isApiError, type ApiError } from 'backend/types';
import { isDevelopment } from '../helpers/environment';
import { browser } from '$app/environment';
import { InternalServerError } from 'backend/errors';
import { devtoolsLink } from 'trpc-client-devtools-link';

export type FetchFunc = (
	input: RequestInfo | URL,
	init?: RequestInit | undefined
) => Promise<Response>;

export const isTrpcClientError = (error: unknown): error is TRPCClientError<AppRouter> =>
	error instanceof TRPCClientError;

const logger = loggerLink({ enabled: () => isDevelopment });
const devtools = devtoolsLink({ enabled: isDevelopment });

export const trpc = (fetch: FetchFunc, headers?: Record<string, string>) =>
	createTRPCProxyClient<AppRouter>({
		links: [logger, devtools, httpBatchLink({ url: '/trpc', fetch, headers })],
		transformer
	});

let trpcWsClient: CreateTRPCProxyClient<AppRouter> | null = null;
export const trpcWs = () => {
	if (!browser) {
		throw new Error(
			'TRPC WS client used outside of browser! Use normal http client on server, as it handles cache'
		);
	}

	if (!trpcWsClient) {
		const wsClient = createWSClient({
			url: `${window.location.origin.replace('http', 'ws')}/trpcws`
		});

		trpcWsClient = createTRPCProxyClient({
			links: [logger, devtools, wsLink<AppRouter>({ client: wsClient })],
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
			return { success: false, error: InternalServerError(), data: null };
		}

		return { success: false, error: error.data, data: null };
	}
};
