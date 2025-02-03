import { createError } from '../helpers/control';
import { ApiErrorCode } from '../types/enums/ApiErrorCode';
import { HttpStatus } from '../types/enums/HttpStatus';

export const SensorTemplateNotFound = (id: number) =>
  createError({
    errorCode: ApiErrorCode.SENSOR_TEMPLATE_NOT_FOUND,
    httpStatus: HttpStatus.BAD_REQUEST,
    message: `Sensor template with id: ${id} not found.`
  });
