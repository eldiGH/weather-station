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
import { isDevelopment } from '../helpers';
import { browser } from '$app/environment';
import { InternalServerError } from 'backend/errors';
import { devtoolsLink } from 'trpc-client-devtools-link';
import { getTokensDataCookies, hasValidAccessToken, isLoggedIn, refresh } from '../helpers';
import { goto } from '$app/navigation';

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

type HandledRequestSuccess<Data> = { success: true; data: Data; error: null; wasAborted: false };
type HandledRequestFail = { success: false; error: ApiError; data: null; wasAborted: false };
type HandledRequestAborted = { success: false; error: null; data: null; wasAborted: true };

type HandledRequest<Data, Abortable extends boolean> = Abortable extends true
	? HandledRequestSuccess<Data> | HandledRequestFail | HandledRequestAborted
	: HandledRequestSuccess<Data> | HandledRequestFail;

export const handleTRPCErrors = async <
	T,
	O,
	D,
	Abortable extends O extends { signal: AbortSignal } ? true : false
>(
	procedure: (input: T, opts?: O) => Promise<D>,
	input: T,
	opts?: O
): Promise<HandledRequest<D, Abortable>> => {
	try {
		return { success: true, data: await procedure(input, opts), error: null, wasAborted: false };
	} catch (error) {
		if (isTrpcClientError(error) && error.cause?.name === 'ObservableAbortError') {
			return { success: false, error: null, data: null, wasAborted: true } as HandledRequest<
				D,
				Abortable
			>;
		}
		if (!(isTrpcClientError(error) && isApiError(error.data))) {
			return { success: false, error: InternalServerError(), data: null, wasAborted: false };
		}

		return { success: false, error: error.data, data: null, wasAborted: false };
	}
};

let refetchPromise: Promise<ApiError | undefined> | null = null;
export const handleAuthedTRPCErrors = async <
	T,
	O extends { signal?: AbortSignal },
	D,
	Abortable extends O extends { signal: AbortSignal } ? true : false
>(
	procedure: (input: T, opts?: O) => Promise<D>,
	input: T,
	opts?: O
): Promise<HandledRequest<D, Abortable>> => {
	if (browser) {
		const tokensData = getTokensDataCookies();

		if (!isLoggedIn(tokensData)) {
			await goto('/login');
			throw Error('Not authorized');
		}

		if (!hasValidAccessToken(tokensData)) {
			let error: ApiError | undefined;
			if (refetchPromise) {
				error = await refetchPromise;
			} else {
				refetchPromise = refresh();
				error = await refetchPromise;
			}
			refetchPromise = null;

			if (error) {
				goto('/login');
				throw error;
			}
		}
	}

	if (opts?.signal?.aborted) {
		return { data: null, error: null, wasAborted: true } as HandledRequest<D, Abortable>;
	}

	return handleTRPCErrors(procedure, input, opts);
};
