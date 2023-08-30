import { ApiErrorCode, HttpStatus, type ApiError } from '../types';

export const SensorNotFound = (sensorId: number): ApiError => ({
  errorCode: ApiErrorCode.SENSOR_NOT_FOUND,
  httpStatus: HttpStatus.BAD_REQUEST,
  message: `Requested sensor with id: ${sensorId} not found`
});
