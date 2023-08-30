import { ValidationError as YupValidationError, type Schema } from 'yup';
import { InternalServerError, ValidationError } from '../errors/index.js';
import type { Middleware } from '../types/index.js';
import { Request } from 'express';

export const validationMiddlewareFactory =
  (schema: Schema, reqProp: keyof Pick<Request, 'body' | 'query' | 'params'>): Middleware =>
  async (req, _res, next) => {
    try {
      const prop = await schema.validate(req[reqProp], { abortEarly: false, stripUnknown: true });
      req[reqProp] = prop;

      next();
    } catch (e) {
      if (e instanceof YupValidationError) {
        return next(ValidationError(e));
      }
      next(InternalServerError());
      console.error(e);
    }
  };
