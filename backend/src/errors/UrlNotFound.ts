import { createError } from '../helpers/control';
import { ApiErrorCode } from '../types/enums/ApiErrorCode';
import { HttpStatus } from '../types/enums/HttpStatus';

export const UrlNotFound = (url: string) =>
  createError({
    errorCode: ApiErrorCode.URL_NOT_FOUND,
    httpStatus: HttpStatus.NOT_FOUND,
    message: `Url '${url}' not found`
  });
