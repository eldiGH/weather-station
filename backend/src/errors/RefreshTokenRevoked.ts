import { ApiErrorCode, HttpStatus } from 'shared';
import { ApiError } from '../types';

export const RefreshTokenRevoked = (): ApiError => ({
  errorCode: ApiErrorCode.NOT_AUTHORIZED,
  httpStatus: HttpStatus.BAD_REQUEST,
  message: `This refresh token is revoked`
});
