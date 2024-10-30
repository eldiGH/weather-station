import { createError } from '../helpers/control';
import { ApiErrorCode } from '../types/enums/ApiErrorCode';
import { HttpStatus } from '../types/enums/HttpStatus';

export const ProcedureNotFound = () =>
  createError({
    errorCode: ApiErrorCode.PROCEDURE_NOT_FOUND,
    httpStatus: HttpStatus.NOT_FOUND,
    message: `Procedure not found`
  });
