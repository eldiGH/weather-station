import type { ApiError } from '../types/ApiError';
import { ApiErrorCode } from '../types/enums/ApiErrorCode';
import { HttpStatus } from '../types/enums/HttpStatus';

export const RefreshTokenRevoked = (): ApiError => ({
  errorCode: ApiErrorCode.NOT_AUTHORIZED,
  httpStatus: HttpStatus.BAD_REQUEST,
  message: `This refresh token is revoked`
});
