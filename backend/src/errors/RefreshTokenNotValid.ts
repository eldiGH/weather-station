import { createError } from '../helpers/control';
import { ApiErrorCode } from '../types/enums/ApiErrorCode';
import { HttpStatus } from '../types/enums/HttpStatus';

export const RefreshTokenNotValid = () =>
  createError({
    errorCode: ApiErrorCode.REFRESH_TOKEN_NOT_VALID,
    httpStatus: HttpStatus.BAD_REQUEST,
    message: `Refresh token is not valid`
  });
