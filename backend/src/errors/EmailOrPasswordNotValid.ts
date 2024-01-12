import type { ApiError } from '../types/ApiError';
import { ApiErrorCode } from '../types/enums/ApiErrorCode';
import { HttpStatus } from '../types/enums/HttpStatus';

export const EmailOrPasswordNotValid = (): ApiError => ({
  errorCode: ApiErrorCode.EMAIL_OR_PASSWORD_NOT_VALID,
  httpStatus: HttpStatus.BAD_REQUEST,
  message: `Email or password is not valid`
});
