import { createError } from '../helpers/control';
import { ApiErrorCode } from '../types/enums/ApiErrorCode';
import { HttpStatus } from '../types/enums/HttpStatus';

export const SensorDataNotFound = () =>
  createError({
    errorCode: ApiErrorCode.SENSOR_DATA_NOT_FOUND,
    httpStatus: HttpStatus.BAD_REQUEST,
    message: `Requested sensor data not found.`
  });
