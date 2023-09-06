import { NotAuthorized } from '../errors';
import { AuthService } from '../services';
import { Middleware } from '../types';
import jwt, { JwtPayload } from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('JWT_SECRET NOT FOUND');
}

export const authMiddleware: Middleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw NotAuthorized();
    }

    const [bearer, token] = authHeader.split(' ');

    if (!bearer || !token || bearer !== 'Bearer') {
      throw NotAuthorized();
    }

    const decodedJwt = jwt.verify(token, jwtSecret) as JwtPayload;

    const user = await AuthService.getUserById(decodedJwt.id);
    if (!user) {
      throw NotAuthorized();
    }

    res.locals.user = user;
    next();
  } catch (e) {
    return next(NotAuthorized());
  }
};
