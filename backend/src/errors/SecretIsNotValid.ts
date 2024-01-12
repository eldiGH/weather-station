import type { ApiError } from '../types/ApiError';
import { ApiErrorCode } from '../types/enums/ApiErrorCode';
import { HttpStatus } from '../types/enums/HttpStatus';

export const SecretIsNotValid = (): ApiError => ({
  errorCode: ApiErrorCode.SECRET_IS_NOT_VALID,
  httpStatus: HttpStatus.BAD_REQUEST,
  message: `Provided secret is not valid`
});
