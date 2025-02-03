import { createError } from '../helpers/control';
import { ApiErrorCode } from '../types/enums/ApiErrorCode';
import { HttpStatus } from '../types/enums/HttpStatus';

export const SensorDataFieldInvalidType = (propertyName: string, type: string) =>
  createError({
    errorCode: ApiErrorCode.SENSOR_DATA_FIELD_INVALID_TYPE,
    httpStatus: HttpStatus.BAD_REQUEST,
    message: `Expected ${propertyName} to be of type ${type}.`
  });
