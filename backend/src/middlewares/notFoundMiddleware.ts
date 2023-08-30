import { UrlNotFound } from '../errors/index.js';
import type { Middleware } from '../types/index.js';

export const notFoundMiddleware: Middleware = (req, _res, next) => {
	next(UrlNotFound(req.path));
};
