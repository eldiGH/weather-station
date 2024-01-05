import config from '@config';
import { TRPCClientError, createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { transformer, type AppRouter } from 'backend/trpc';
import { isApiError } from '../../../../backend/src/types/ApiError';
import type { ApiError } from 'backend/types';

export type FetchFunc = (
	input: RequestInfo | URL,
	init?: RequestInit | undefined
) => Promise<Response>;

export const isTrpcClientError = (error: unknown): error is TRPCClientError<AppRouter> =>
	error instanceof TRPCClientError;

export const trcp = (fetch: FetchFunc) =>
	createTRPCProxyClient<AppRouter>({
		links: [httpBatchLink({ url: config.serverAddress, fetch })],
		transformer
	});

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
