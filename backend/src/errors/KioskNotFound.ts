import { ApiError } from '../types/ApiError';
import { ApiErrorCode } from '../types/enums/ApiErrorCode';
import { HttpStatus } from '../types/enums/HttpStatus';

export const KioskNotFound = (): ApiError => ({
  errorCode: ApiErrorCode.KIOSK_NOT_FOUND,
  httpStatus: HttpStatus.BAD_REQUEST,
  message: `Kiosk not found`
});
