import { ApiErrorCode, HttpStatus } from 'shared';
import { ApiError } from '../types';

export const RefreshTokenNotValid = (): ApiError => ({
  errorCode: ApiErrorCode.NOT_AUTHORIZED,
  httpStatus: HttpStatus.BAD_REQUEST,
  message: `Refresh token is not valid`
});
