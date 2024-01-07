import { AuthService } from '../services/AuthService';
import { Middleware } from '../types/Middleware';

export const authMiddleware: Middleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  const user = await AuthService.authorize(authHeader);

  res.locals.user = user;
  next();
};
