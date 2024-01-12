import { bme68xDataSchema, db } from '../db/drizzle';

export const createBme68xDataEntry = (data: typeof bme68xDataSchema.$inferInsert) =>
  db.insert(bme68xDataSchema).values(data);
