import type { ApiError } from '../types/ApiError';
import { ApiErrorCode } from '../types/enums/ApiErrorCode';
import { HttpStatus } from '../types/enums/HttpStatus';

export const NotAuthorized = (): ApiError => ({
  errorCode: ApiErrorCode.NOT_AUTHORIZED,
  httpStatus: HttpStatus.UNAUTHORIZED,
  message: `Not authorized`
});
