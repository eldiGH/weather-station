import type { ZodError } from 'zod';
import { createError } from '../helpers/control';
import { ApiErrorCode } from '../types/enums/ApiErrorCode';
import { HttpStatus } from '../types/enums/HttpStatus';

export const ValidationError = (zodError: ZodError) =>
  createError({
    errorCode: ApiErrorCode.VALIDATION_ERROR,
    httpStatus: HttpStatus.BAD_REQUEST,
    message: `Validation error.`,
    issues: zodError.issues
  });

export type ValidationErrorType = ReturnType<typeof ValidationError>;
