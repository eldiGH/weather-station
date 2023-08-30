import { ValidationError as YupValidationError, type Schema } from 'yup';
import { InternalServerError, ValidationError } from '../errors/index.js';
import type { Middleware } from '../types/index.js';

export const validationMiddlewareFactory =
  (schema: Schema): Middleware =>
  async (req, _res, next) => {
    try {
      const body = await schema.validate(req.body, { abortEarly: false, stripUnknown: true });
      req.body = body;
      next();
    } catch (e) {
      if (e instanceof YupValidationError) {
        return next(ValidationError(e as YupValidationError));
      }
      next(InternalServerError());
      console.error(e);
    }
  };
