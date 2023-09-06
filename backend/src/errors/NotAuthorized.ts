import { ApiErrorCode, HttpStatus } from 'shared';
import { ApiError } from '../types';

export const NotAuthorized = (): ApiError => ({
  errorCode: ApiErrorCode.NOT_AUTHORIZED,
  httpStatus: HttpStatus.UNAUTHORIZED,
  message: `Not authorized`
});
