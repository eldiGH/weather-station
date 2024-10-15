import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { addDays, addMinutes } from 'date-fns';
import { EmailAlreadyInUse } from '../errors/EmailAlreadyInUse';
import { EmailOrPasswordNotValid } from '../errors/EmailOrPasswordNotValid';
import { RefreshTokenNotValid } from '../errors/RefreshTokenNotValid';
import { RefreshTokenRevoked } from '../errors/RefreshTokenRevoked';
import type { LoginInput } from '../schemas';
import { NotAuthorized } from '../errors/NotAuthorized';
import { createUserReturning, getUserByEmail, getUserById } from '../repositories/user';
import {
  createRefreshToken,
  deleteTokenSession,
  getRefreshTokenByToken,
  updateRevokedInTokenSession,
  updateRevokedOnToken
} from '../repositories/refreshToken';
import type { JwtPayload } from '../types/JwtPayload';
import type { userSchema } from '../db/drizzle/schema';
import { isApiError } from '../types';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('JWT_SECRET NOT FOUND');
}

const ACCESS_TOKEN_EXPIRES_IN_MINUTES = 5;
const REFRESH_TOKEN_EXPIRES_IN_DAYS = 30;

const validateEmail = async (email: string) => {
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    throw EmailAlreadyInUse(email);
  }
};

const generateNewTokens = async (userId: number, sessionId: string) => {
  const payload: JwtPayload = { id: userId };

  const accessToken = jwt.sign(payload, jwtSecret, {
    expiresIn: `${ACCESS_TOKEN_EXPIRES_IN_MINUTES}m`
  });
  const accessTokenExpDate = addMinutes(new Date(), ACCESS_TOKEN_EXPIRES_IN_MINUTES);

  const refreshToken = uuid();
  const refreshTokenExpDate = addDays(new Date(), REFRESH_TOKEN_EXPIRES_IN_DAYS);

  await createRefreshToken({
    token: refreshToken,
    userId,
    sessionId,
    expirationDate: refreshTokenExpDate
  });

  return {
    accessToken: { token: accessToken, expires: accessTokenExpDate },
    refreshToken: { token: refreshToken, expires: refreshTokenExpDate }
  };
};

const validateRefreshToken = async (refreshToken?: string) => {
  if (!refreshToken) {
    throw RefreshTokenNotValid();
  }

  const dbToken = await getRefreshTokenByToken(refreshToken);

  if (!dbToken) {
    throw RefreshTokenNotValid();
  }

  if (dbToken.revoked) {
    await updateRevokedInTokenSession(true, dbToken.sessionId);

    throw RefreshTokenRevoked();
  }

  return dbToken;
};

export const AuthService = {
  register: async ({ email, password }: typeof userSchema.$inferInsert) => {
    await validateEmail(email);

    const hashedPassword = await bcryptjs.hash(password, 10);

    const finalUser = { email, password: hashedPassword };

    const createdUser = await createUserReturning(finalUser);

    return await generateNewTokens(createdUser.id, uuid());
  },

  login: async (data: LoginInput) => {
    const user = await getUserByEmail(data.email);

    if (!user) {
      throw EmailOrPasswordNotValid();
    }

    const isPasswordValid = await bcryptjs.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw EmailOrPasswordNotValid();
    }

    return await generateNewTokens(user.id, uuid());
  },

  logout: async (refreshToken?: string) => {
    const dbToken = await validateRefreshToken(refreshToken);

    await deleteTokenSession(dbToken.sessionId);
  },

  refresh: async (refreshToken?: string) => {
    const dbToken = await validateRefreshToken(refreshToken);

    await updateRevokedOnToken(true, dbToken.id);

    return await generateNewTokens(dbToken.userId, dbToken.sessionId);
  },

  authorize: async (authHeader?: string) => {
    if (!authHeader) {
      throw NotAuthorized();
    }

    const [bearer, token] = authHeader.split(' ');

    if (!bearer || !token || bearer !== 'Bearer') {
      throw NotAuthorized();
    }

    try {
      const decodedJwt = jwt.verify(token, jwtSecret) as JwtPayload;

      const user = await getUserById(decodedJwt.id);
      if (!user) {
        throw NotAuthorized();
      }

      return user;
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        throw NotAuthorized();
      }

      throw e;
    }
  }
};
