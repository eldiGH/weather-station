import { db } from '../db/drizzle';
import { bme68xDataSchema } from '../db/drizzle/schema';

export const createBme68xDataEntry = (data: typeof bme68xDataSchema.$inferInsert) =>
  db.insert(bme68xDataSchema).values(data);
