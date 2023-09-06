import { ApiErrorCode, HttpStatus } from 'shared';
import { ApiError } from '../types';

export const SensorDataNotFound = (): ApiError => ({
  errorCode: ApiErrorCode.SENSOR_NAME_ALREADY_USED,
  httpStatus: HttpStatus.BAD_REQUEST,
  message: `Requested sensor data not found.`
});
