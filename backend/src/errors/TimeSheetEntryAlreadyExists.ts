import type { ApiError } from '../types/ApiError';
import { ApiErrorCode } from '../types/enums/ApiErrorCode';
import { HttpStatus } from '../types/enums/HttpStatus';

export const TimeSheetEntryAlreadyExists = (): ApiError => ({
  errorCode: ApiErrorCode.TIME_SHEET_ENTRY_ALREADY_EXISTS,
  httpStatus: HttpStatus.BAD_REQUEST,
  message: `Time sheet entry already exists.`
});
