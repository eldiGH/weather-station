import type { ApiError } from '../types/ApiError';
import { ApiErrorCode } from '../types/enums/ApiErrorCode';
import { HttpStatus } from '../types/enums/HttpStatus';

export const AccessDenied = (description: string): ApiError => ({
  errorCode: ApiErrorCode.ACCESS_DENIED,
  httpStatus: HttpStatus.FORBIDDEN,
  message: `You do not have access to this resource: ${description}.`
});
