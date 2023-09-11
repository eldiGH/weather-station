import { ApiErrorCode, HttpStatus } from 'shared';
import { ApiError } from '../types';

export const KioskNotFound = (): ApiError => ({
  errorCode: ApiErrorCode.KIOSK_NOT_FOUND,
  httpStatus: HttpStatus.BAD_REQUEST,
  message: `Kiosk not found`
});
