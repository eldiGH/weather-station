import { ApiErrorCode, HttpStatus, type ApiError } from '../types';

export const SensorNameAlreadyUsed = (name: string): ApiError => ({
  errorCode: ApiErrorCode.SENSOR_NAME_ALREADY_USED,
  httpStatus: HttpStatus.BAD_REQUEST,
  message: `Sensor name ${name} is already in use.`
});
