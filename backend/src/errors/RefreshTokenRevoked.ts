import { createError } from '../helpers/control';
import { ApiErrorCode } from '../types/enums/ApiErrorCode';
import { HttpStatus } from '../types/enums/HttpStatus';

export const RefreshTokenRevoked = () =>
  createError({
    errorCode: ApiErrorCode.REFRESH_TOKEN_REVOKED,
    httpStatus: HttpStatus.BAD_REQUEST,
    message: `This refresh token is revoked`
  });
