import { isApiError, type ApiError } from '../types';
import type { NextFunction, Request, Response } from 'express';
import { InternalServerError } from '../errors/index.js';

export const errorHandlerMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }

  if (!isApiError(err)) {
    console.error(err);
  }

  const { httpStatus, ...errorProps }: ApiError = isApiError(err) ? err : InternalServerError();

  res.status(httpStatus).send(errorProps);
};
