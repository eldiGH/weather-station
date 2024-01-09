import { Prisma, RefreshToken } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { addDays, addMinutes } from 'date-fns';
import { db } from '../db/prisma';
import { EmailAlreadyInUse } from '../errors/EmailAlreadyInUse';
import { EmailOrPasswordNotValid } from '../errors/EmailOrPasswordNotValid';
import { RefreshTokenNotValid } from '../errors/RefreshTokenNotValid';
import { RefreshTokenRevoked } from '../errors/RefreshTokenRevoked';
import { LoginInput } from '../schemas';
import { NotAuthorized } from '../errors/NotAuthorized';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('JWT_SECRET NOT FOUND');
}

const ACCESS_TOKEN_EXPIRES_IN_MINUTES = 5;
const REFRESH_TOKEN_EXPIRES_IN_DAYS = 30;

const validateEmail = async (email: string) => {
  const existingUser = await db.user.findFirst({
    where: { email }
  });

  if (existingUser) {
    throw EmailAlreadyInUse(email);
  }
};

const register = async (playerData: Prisma.UserCreateInput) => {
  await validateEmail(playerData.email);

  const password = await bcryptjs.hash(playerData.password, 10);

  const user = await db.user.create({ data: { ...playerData, password } });

  return await generateNewTokens(user.id, uuid());
};

const generateNewTokens = async (userId: number, sessionId: string) => {
  const payload: JwtPayload = { id: userId };

  const accessToken = jwt.sign(payload, jwtSecret, {
    expiresIn: `${ACCESS_TOKEN_EXPIRES_IN_MINUTES}m`
  });
  const accessTokenExpDate = addMinutes(new Date(), ACCESS_TOKEN_EXPIRES_IN_MINUTES);

  const refreshToken = uuid();
  const refreshTokenExpDate = addDays(new Date(), REFRESH_TOKEN_EXPIRES_IN_DAYS);

  await db.refreshToken.create({
    data: { token: refreshToken, userId: userId, sessionId, expirationDate: refreshTokenExpDate }
  });

  return {
    accessToken: { token: accessToken, expires: accessTokenExpDate },
    refreshToken: { token: refreshToken, expires: refreshTokenExpDate }
  };
};

const login = async (data: LoginInput) => {
  const user = await db.user.findFirst({ where: { email: data.email } });

  if (!user) {
    throw EmailOrPasswordNotValid();
  }

  const isPasswordValid = await bcryptjs.compare(data.password, user.password);
  if (!isPasswordValid) {
    throw EmailOrPasswordNotValid();
  }

  return generateNewTokens(user.id, uuid());
};

const validateRefreshToken = async (refreshToken?: string): Promise<RefreshToken> => {
  if (!refreshToken) {
    throw RefreshTokenNotValid();
  }

  const dbToken = await db.refreshToken.findUnique({ where: { token: refreshToken } });
  if (!dbToken) {
    throw RefreshTokenNotValid();
  }

  if (dbToken.revoked) {
    await db.refreshToken.updateMany({
      data: { revoked: true },
      where: { sessionId: dbToken.sessionId, revoked: false }
    });

    throw RefreshTokenRevoked();
  }

  return dbToken;
};

const logout = async (refreshToken?: string): Promise<void> => {
  const dbToken = await validateRefreshToken(refreshToken);

  await db.refreshToken.deleteMany({ where: { sessionId: dbToken.sessionId } });
};

const refresh = async (refreshToken?: string) => {
  const dbToken = await validateRefreshToken(refreshToken);

  await db.refreshToken.update({ data: { revoked: true }, where: { id: dbToken.id } });

  return generateNewTokens(dbToken.userId, dbToken.sessionId);
};

const authorize = async (authHeader?: string) => {
  if (!authHeader) {
    throw NotAuthorized();
  }

  const [bearer, token] = authHeader.split(' ');

  if (!bearer || !token || bearer !== 'Bearer') {
    throw NotAuthorized();
  }

  const decodedJwt = jwt.verify(token, jwtSecret) as JwtPayload;

  const user = await getUserById(decodedJwt.id);
  if (!user) {
    throw NotAuthorized();
  }

  return user;
};

const getUserById = async (id: number) => db.user.findUnique({ where: { id } });

export const AuthService = { register, login, getUserById, refresh, logout, authorize };
