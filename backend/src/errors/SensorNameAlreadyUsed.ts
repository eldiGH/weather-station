import { createError } from '../helpers/control';
import { ApiErrorCode } from '../types/enums/ApiErrorCode';
import { HttpStatus } from '../types/enums/HttpStatus';

export const SensorNameAlreadyUsed = (name: string) =>
  createError({
    errorCode: ApiErrorCode.SENSOR_NAME_ALREADY_USED,
    httpStatus: HttpStatus.BAD_REQUEST,
    message: `Sensor name ${name} is already in use.`
  });
