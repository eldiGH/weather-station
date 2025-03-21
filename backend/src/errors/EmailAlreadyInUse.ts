import { createError } from '../helpers/control';
import { ApiErrorCode } from '../types/enums/ApiErrorCode';
import { HttpStatus } from '../types/enums/HttpStatus';

export const EmailAlreadyInUse = (email: string) =>
  createError({
    errorCode: ApiErrorCode.EMAIL_ALREADY_IN_USE,
    httpStatus: HttpStatus.BAD_REQUEST,
    message: `Email '${email}' is already in use`
  });
