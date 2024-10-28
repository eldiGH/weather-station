import { type ApiError } from '../types';
import type { ApiResponseSuccess } from '../types/Control';

export const createError = <const T extends ApiError>(error: T): T => error;

export const Ok = <T>(data?: T): ApiResponseSuccess<T> => ({ data: data as T, error: undefined });
export const Err = <const T extends ApiError>(error: T) => ({ data: undefined, error });
