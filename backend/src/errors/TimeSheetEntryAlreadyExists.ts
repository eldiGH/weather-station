import { createError } from '../helpers/control';
import { ApiErrorCode } from '../types/enums/ApiErrorCode';
import { HttpStatus } from '../types/enums/HttpStatus';

export const TimeSheetEntryAlreadyExists = () =>
  createError({
    errorCode: ApiErrorCode.TIME_SHEET_ENTRY_ALREADY_EXISTS,
    httpStatus: HttpStatus.BAD_REQUEST,
    message: `Time sheet entry already exists.`
  });
