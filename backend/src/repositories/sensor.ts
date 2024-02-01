import { eq, inArray } from 'drizzle-orm';
import { db } from '../db/drizzle';
import { getSQLForDates } from '../helpers/db';
import type { QueryDates, QueryLimit } from '../types/QueryOptions';
import { sensorSchema, bme68xDataSchema } from '../db/drizzle/schema';

export const getSensorBySecret = async (secret: string) =>
  (await db.select().from(sensorSchema).where(eq(sensorSchema.secret, secret))).shift();

export const getSensorByName = async (name: string) =>
  (await db.select().from(sensorSchema).where(eq(sensorSchema.name, name))).shift();

export const getSensorWithBme68xData = async (
  sensorId: number,
  options?: QueryLimit & QueryDates
) =>
  db.query.sensorSchema.findFirst({
    with: {
      bme68xData: {
        limit: options?.limit,
        where: getSQLForDates(bme68xDataSchema.createdAt, options?.dates)
      }
    },
    where: (sensor, { eq }) => eq(sensor.id, sensorId)
  });

export const getSensorsWithIds = (ids: number[]) =>
  db.select().from(sensorSchema).where(inArray(sensorSchema.id, ids));

export const getAllSensorsSecrets = async () => {
  const secrets = await db.select({ secret: sensorSchema.secret }).from(sensorSchema);

  return secrets.map(({ secret }) => secret);
};

export const createSensor = (data: typeof sensorSchema.$inferInsert) =>
  db.insert(sensorSchema).values(data);
