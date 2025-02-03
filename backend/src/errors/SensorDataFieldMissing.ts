import { createError } from '../helpers/control';
import { ApiErrorCode } from '../types/enums/ApiErrorCode';
import { HttpStatus } from '../types/enums/HttpStatus';

export const SensorDataFieldMissing = (propertyName: string) =>
  createError({
    errorCode: ApiErrorCode.SENSOR_DATA_FIELD_MISSING,
    httpStatus: HttpStatus.BAD_REQUEST,
    message: `Field ${propertyName} missing.`
  });
