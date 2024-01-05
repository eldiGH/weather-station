import { ApiError } from '../types/ApiError';
import { ApiErrorCode } from '../types/enums/ApiErrorCode';
import { HttpStatus } from '../types/enums/HttpStatus';

export const PermissionDenied = (): ApiError => ({
  errorCode: ApiErrorCode.PERMISSION_DENIED,
  httpStatus: HttpStatus.FORBIDDEN,
  message: `Permission denied`
});
