import { createError } from '../helpers/control';
import { ApiErrorCode } from '../types/enums/ApiErrorCode';
import { HttpStatus } from '../types/enums/HttpStatus';

export const InternalServerError = () =>
  createError({
    errorCode: ApiErrorCode.INTERNAL_SERVER_ERROR,
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
    message: `Internal server error`
  });
