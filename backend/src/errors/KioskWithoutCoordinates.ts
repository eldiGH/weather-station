import type { ApiError } from '../types/ApiError';
import { ApiErrorCode } from '../types/enums/ApiErrorCode';
import { HttpStatus } from '../types/enums/HttpStatus';

export const KioskWithoutCoordinates = (): ApiError => ({
  errorCode: ApiErrorCode.EMAIL_ALREADY_IN_USE,
  httpStatus: HttpStatus.BAD_REQUEST,
  message: `Provided kiosk does not have geographical coordinates`
});
