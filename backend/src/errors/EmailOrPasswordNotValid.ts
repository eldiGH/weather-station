import { ApiErrorCode, HttpStatus } from 'shared';
import { ApiError } from '../types';

export const EmailOrPasswordNotValid = (): ApiError => ({
  errorCode: ApiErrorCode.EMAIL_OR_PASSWORD_NOT_VALID,
  httpStatus: HttpStatus.BAD_REQUEST,
  message: `Email or password is not valid`
});
