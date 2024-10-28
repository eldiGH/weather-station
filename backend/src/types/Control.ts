import { isApiError, type ApiError } from './ApiError';

export type ApiResponseSuccess<T> = { data: T; error?: undefined };
export type ApiResponseFail<T extends ApiError = ApiError> = { data?: undefined; error: T };

export type ApiResponse<T = unknown> = ApiResponseSuccess<T> | ApiResponseFail;

export const isApiResponse = (response: unknown): response is ApiResponse<unknown> => {
  if (typeof response !== 'object' || response === null || response === undefined) {
    return false;
  }

  if (
    'error' in response &&
    response.error !== undefined &&
    isApiError(response.error) &&
    (!('data' in response) || response.data === undefined)
  ) {
    return true;
  }

  if ('data' in response && (!('error' in response) || response.error === undefined)) {
    return true;
  }

  return false;
};

export type ExtractResponseDataType<T extends ApiResponse<unknown>> =
  T extends ApiResponse<infer Data> ? Exclude<Data, undefined> : never;
