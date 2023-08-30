import { ApiErrorCode, HttpStatus, type ApiError } from '../types';

export const SensorDataNotFound = (): ApiError => ({
  errorCode: ApiErrorCode.SENSOR_NAME_ALREADY_USED,
  httpStatus: HttpStatus.BAD_REQUEST,
  message: `Requested sensor data not found.`
});
