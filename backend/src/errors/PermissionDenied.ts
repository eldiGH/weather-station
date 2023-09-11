import { ApiErrorCode, HttpStatus } from 'shared';
import { ApiError } from '../types';

export const PermissionDenied = (): ApiError => ({
  errorCode: ApiErrorCode.PERMISSION_DENIED,
  httpStatus: HttpStatus.FORBIDDEN,
  message: `Permission denied`
});
