import { createError } from '../helpers/control';
import { ApiErrorCode } from '../types/enums/ApiErrorCode';
import { HttpStatus } from '../types/enums/HttpStatus';

export const PermissionDenied = () =>
  createError({
    errorCode: ApiErrorCode.PERMISSION_DENIED,
    httpStatus: HttpStatus.FORBIDDEN,
    message: `Permission denied`
  });
