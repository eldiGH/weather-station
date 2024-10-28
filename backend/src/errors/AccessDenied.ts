import { createError } from '../helpers/control';
import { ApiErrorCode } from '../types/enums/ApiErrorCode';
import { HttpStatus } from '../types/enums/HttpStatus';

export const AccessDenied = <const T extends string>(description: T) =>
  createError({
    errorCode: ApiErrorCode.ACCESS_DENIED,
    httpStatus: HttpStatus.FORBIDDEN,
    message: `You do not have access to this resource: ${description}.`
  });
