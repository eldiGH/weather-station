import { createError } from '../helpers/control';
import { ApiErrorCode } from '../types/enums/ApiErrorCode';
import { HttpStatus } from '../types/enums/HttpStatus';

export const TimeSheetNameAlreadyUsed = (name: string) =>
  createError({
    errorCode: ApiErrorCode.TIME_SHEET_NAME_ALREADY_USED,
    httpStatus: HttpStatus.BAD_REQUEST,
    message: `You already created time sheet with name ${name}.`
  });
