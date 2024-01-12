import { eq } from 'drizzle-orm';
import { db } from '../db/drizzle';
import { userSchema } from '../db/drizzle/schema';

export const getUserByEmail = async (email: string) =>
  (await db.select().from(userSchema).where(eq(userSchema.email, email))).shift();

export const getUserById = async (id: number) =>
  (await db.select().from(userSchema).where(eq(userSchema.id, id))).shift();

export const createUser = (data: typeof userSchema.$inferInsert) =>
  db.insert(userSchema).values(data);

export const createUserReturning = async (data: typeof userSchema.$inferInsert) =>
  (await createUser(data).returning())[0];
