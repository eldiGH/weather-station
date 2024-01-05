import { Prisma, RefreshToken } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { fromUnixTime } from 'date-fns';
import { db } from '../db/prisma';
import { EmailAlreadyInUse } from '../errors/EmailAlreadyInUse';
import { EmailOrPasswordNotValid } from '../errors/EmailOrPasswordNotValid';
import { RefreshTokenNotValid } from '../errors/RefreshTokenNotValid';
import { RefreshTokenRevoked } from '../errors/RefreshTokenRevoked';
import { LoginInput } from '../schemas';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('JWT_SECRET NOT FOUND');
}

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

  const accessToken = jwt.sign(payload, jwtSecret, { expiresIn: '5m' });
  const refreshToken = jwt.sign({}, jwtSecret, { expiresIn: '90d' });

  const { exp } = jwt.verify(refreshToken, jwtSecret) as jwt.JwtPayload;

  if (!exp) {
    throw Error('No expiration date!');
  }

  const expDate = fromUnixTime(exp);

  await db.refreshToken.create({
    data: { token: refreshToken, userId: userId, sessionId, expirationDate: expDate }
  });

  return { accessToken, refreshToken };
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

const validateRefreshToken = async (refreshToken: string): Promise<RefreshToken> => {
  try {
    jwt.verify(refreshToken, jwtSecret);
  } catch (e) {
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

const logout = async (refreshToken: string): Promise<void> => {
  const dbToken = await validateRefreshToken(refreshToken);

  await db.refreshToken.deleteMany({ where: { sessionId: dbToken.sessionId } });
};

const refresh = async (refreshToken: string) => {
  const dbToken = await validateRefreshToken(refreshToken);

  await db.refreshToken.update({ data: { revoked: true }, where: { id: dbToken.id } });

  return generateNewTokens(dbToken.userId, dbToken.sessionId);
};

const getUserById = async (id: number) => db.user.findUnique({ where: { id } });

export const AuthService = { register, login, getUserById, refresh, logout };
