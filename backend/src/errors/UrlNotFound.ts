import { ApiErrorCode, HttpStatus } from 'shared';
import { ApiError } from '../types';

export const UrlNotFound = (url: string): ApiError => ({
  errorCode: ApiErrorCode.URL_NOT_FOUND,
  httpStatus: HttpStatus.NOT_FOUND,
  message: `Url '${url}' not found`
});
