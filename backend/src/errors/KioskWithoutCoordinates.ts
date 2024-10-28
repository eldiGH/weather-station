import { createError } from '../helpers/control';
import { ApiErrorCode } from '../types/enums/ApiErrorCode';
import { HttpStatus } from '../types/enums/HttpStatus';

export const KioskWithoutCoordinates = () =>
  createError({
    errorCode: ApiErrorCode.KIOSK_WITHOUT_COORDINATES,
    httpStatus: HttpStatus.BAD_REQUEST,
    message: `Provided kiosk does not have geographical coordinates`
  });
