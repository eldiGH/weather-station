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
import { isDevelopment } from '../helpers/environment';
import { browser } from '$app/environment';
import { devtoolsLink } from 'trpc-client-devtools-link';
import { getTokensDataCookies, hasValidAccessToken, isLoggedIn, refresh } from '../helpers/auth';
import { goto } from '$app/navigation';
import { isApiError, type ApiError } from 'backend/types';
import { type ValidationErrorType } from 'backend/errors';
import type { ApiResponseFail } from '../../../backend/src/types/Control';
import type { ProcedureOptions } from '@trpc/server';

export type FetchFunc = (
	input: RequestInfo | URL,
	init?: RequestInit | undefined
) => Promise<Response>;

type AddValidationError<T> = {
	[key in keyof T]: T[key] extends (input: infer Input, opts?: infer Opts) => infer Return
		? (
				input: Input,
				opts?: Opts
			) => Input extends void | undefined
				? Return
				: Return | Promise<ApiResponseFail<ValidationErrorType>>
		: T[key] extends Record<string, unknown>
			? AddValidationError<T[key]>
			: T[key];
};

type WithWasAborted<T, Opts> = T & {
	wasAborted: Opts extends { signal: AbortSignal } ? boolean : false;
};

type AddWasAborted<T> = {
	[key in keyof T]: T[key] extends (input: infer Input, opts?: ProcedureOptions) => infer Return
		? <O extends ProcedureOptions>(
				input: Input,
				opts?: O
			) => Promise<WithWasAborted<Awaited<Return>, O>>
		: T[key] extends Record<string, unknown>
			? AddWasAborted<T[key]>
			: T[key];
};

type MyClient = AddWasAborted<AddValidationError<CreateTRPCProxyClient<AppRouter>>>;

export const isTrpcClientError = (error: unknown): error is TRPCClientError<AppRouter> =>
	error instanceof TRPCClientError;

const logger = loggerLink({ enabled: () => isDevelopment });
const devtools = devtoolsLink({ enabled: isDevelopment });

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

const TRPC_OPS = ['subscribe', 'query', 'mutate'];
const createRecursiveTrpcProxy = (handler: (path: string[]) => unknown, path: string[] = []) =>
	new Proxy(
		{},
		{
			get(_, property) {
				const currentPath = [...path, property as string];

				if (TRPC_OPS.includes(property as string)) {
					return handler(currentPath);
				}

				return createRecursiveTrpcProxy(handler, currentPath);
			}
		}
	);

const getPropertyFromPath = <T>(obj: Record<string, unknown>, path: string[]) => {
	let property = obj;

	for (const item of path) {
		property = property[item as keyof typeof property] as Record<string, unknown>;
	}

	return property as T;
};

export const trpc = (fetch: FetchFunc, headers?: Record<string, string>) => {
	const client = createTRPCProxyClient<AppRouter>({
		links: [logger, devtools, httpBatchLink({ url: '/trpc', fetch, headers })],
		transformer
	});

	const proxy = createRecursiveTrpcProxy((path) => {
		return async (input?: unknown, opts?: ProcedureOptions) => {
			const trpcProcedure = <(input?: unknown, opts?: ProcedureOptions) => Promise<unknown>>(
				getPropertyFromPath(client, path)
			);

			try {
				return { data: await trpcProcedure(input, opts), wasAborted: false };
			} catch (error) {
				if (isTrpcClientError(error)) {
					if (error.cause?.name === 'ObservableAbortError') {
						return { wasAborted: true };
					}

					if (isApiError(error.shape)) {
						return { error: error.shape };
					}
				}

				throw error;
			}
		};
	});

	return proxy as MyClient;
};

let refetchPromise: Promise<ApiError | undefined> | null = null;
export const trpcAuthed = (fetch: FetchFunc) => {
	const client = trpc(fetch);

	const proxy = createRecursiveTrpcProxy((path) => {
		return async (input?: unknown, opts?: ProcedureOptions) => {
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
				return { wasAborted: true };
			}

			const trpcProcedure = <(input?: unknown, opts?: ProcedureOptions) => Promise<unknown>>(
				getPropertyFromPath(client, path)
			);

			return await trpcProcedure(input, opts);
		};
	});

	return proxy as MyClient;
};
