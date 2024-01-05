import { ApiError } from '../types/ApiError';
import { ApiErrorCode } from '../types/enums/ApiErrorCode';
import { HttpStatus } from '../types/enums/HttpStatus';

export const SensorNotFound = (sensorId: number): ApiError => ({
  errorCode: ApiErrorCode.SENSOR_NOT_FOUND,
  httpStatus: HttpStatus.BAD_REQUEST,
  message: `Requested sensor with id: ${sensorId} not found`
});
