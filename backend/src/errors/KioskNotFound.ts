import { createError } from '../helpers/control';
import { ApiErrorCode } from '../types/enums/ApiErrorCode';
import { HttpStatus } from '../types/enums/HttpStatus';

export const KioskNotFound = () =>
  createError({
    errorCode: ApiErrorCode.KIOSK_NOT_FOUND,
    httpStatus: HttpStatus.BAD_REQUEST,
    message: `Kiosk not found`
  });
