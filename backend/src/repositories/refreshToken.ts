import { and, eq } from 'drizzle-orm';
import { db } from '../db/drizzle';
import { refreshTokenSchema } from '../db/drizzle/schema';

export const createRefreshToken = (data: typeof refreshTokenSchema.$inferInsert) =>
  db.insert(refreshTokenSchema).values(data);

export const getRefreshTokenByToken = async (token: string) =>
  (await db.select().from(refreshTokenSchema).where(eq(refreshTokenSchema.token, token))).shift();

export const updateRevokedInTokenSession = (revoked: boolean, sessionId: string) =>
  db
    .update(refreshTokenSchema)
    .set({ revoked })
    .where(
      and(eq(refreshTokenSchema.sessionId, sessionId), eq(refreshTokenSchema.revoked, !revoked))
    );

export const deleteTokenSession = (sessionId: string) =>
  db.delete(refreshTokenSchema).where(eq(refreshTokenSchema.sessionId, sessionId));

export const updateRevokedOnToken = (revoked: boolean, tokenId: number) =>
  db.update(refreshTokenSchema).set({ revoked }).where(eq(refreshTokenSchema.id, tokenId));
