import { ApiErrorCode, HttpStatus } from 'shared';
import { ApiError } from '../types';

export const KioskWithoutCoordinates = (): ApiError => ({
  errorCode: ApiErrorCode.EMAIL_ALREADY_IN_USE,
  httpStatus: HttpStatus.BAD_REQUEST,
  message: `Provided kiosk does not have geographical coordinates`
});
