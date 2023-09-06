import { ApiErrorCode, HttpStatus } from 'shared';
import { ApiError } from '../types';
import type { ValidationError as YupValidationError } from 'yup';

interface ValidationResponseError {
  [path: string]: string[];
}

const yupValidationErrorMapper = (error: YupValidationError): ValidationResponseError => {
  const finalErrors: ValidationResponseError = {};

  for (const [i, errorDetail] of error.inner.entries()) {
    const path = errorDetail.path ?? `undefined${i}`;

    finalErrors[path] = errorDetail.errors;
  }

  return finalErrors;
};

export const ValidationError = (error: YupValidationError): ApiError => ({
  errorCode: ApiErrorCode.VALIDATION_ERROR,
  httpStatus: HttpStatus.BAD_REQUEST,
  message: `Validation error`,
  errors: yupValidationErrorMapper(error)
});
