import { createError } from '../helpers/control';
import { ApiErrorCode } from '../types/enums/ApiErrorCode';
import { HttpStatus } from '../types/enums/HttpStatus';

export const TimeSheetNotFound = () =>
  createError({
    errorCode: ApiErrorCode.TIME_SHEET_NOT_FOUND,
    httpStatus: HttpStatus.NOT_FOUND,
    message: `Time sheet not found.`
  });
