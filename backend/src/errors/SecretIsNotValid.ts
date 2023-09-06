import { ApiErrorCode, HttpStatus } from 'shared';
import { ApiError } from '../types';

export const SecretIsNotValid = (): ApiError => ({
  errorCode: ApiErrorCode.SECRET_IS_NOT_VALID,
  httpStatus: HttpStatus.BAD_REQUEST,
  message: `Provided secret is not valid`
});
