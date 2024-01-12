import type { ApiError } from '../types/ApiError';
import { ApiErrorCode } from '../types/enums/ApiErrorCode';
import { HttpStatus } from '../types/enums/HttpStatus';

export const EmailAlreadyInUse = (email: string): ApiError => ({
  errorCode: ApiErrorCode.EMAIL_ALREADY_IN_USE,
  httpStatus: HttpStatus.BAD_REQUEST,
  message: `Email '${email}' is already in use`
});
