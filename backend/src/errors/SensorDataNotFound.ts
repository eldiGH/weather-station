import { ApiError } from '../types/ApiError';
import { ApiErrorCode } from '../types/enums/ApiErrorCode';
import { HttpStatus } from '../types/enums/HttpStatus';

export const SensorDataNotFound = (): ApiError => ({
  errorCode: ApiErrorCode.SENSOR_NAME_ALREADY_USED,
  httpStatus: HttpStatus.BAD_REQUEST,
  message: `Requested sensor data not found.`
});
