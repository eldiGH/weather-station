import { createError } from '../helpers/control';
import { ApiErrorCode } from '../types/enums/ApiErrorCode';
import { HttpStatus } from '../types/enums/HttpStatus';

export const NotAuthorized = () =>
  createError({
    errorCode: ApiErrorCode.NOT_AUTHORIZED,
    httpStatus: HttpStatus.UNAUTHORIZED,
    message: `Not authorized`
  });
