import { eq } from 'drizzle-orm';
import { bme68xDataSchema, db, kioskSchema, kioskToSensorSchema } from '../db/drizzle';
import { QueryDates, QueryLimit, QueryOrder } from '../types/QueryOptions';
import { getSQLForDates, getSQLForOrder } from '../helpers/db';

export const getKioskByUuid = async (kioskUuid: string) =>
  (await db.select().from(kioskSchema).where(eq(kioskSchema.kioskUuid, kioskUuid))).shift();

export const createKioskWithSensors = async (
  kioskData: typeof kioskSchema.$inferInsert,
  sensorIds: number[]
) => {
  const kiosk = (await db.insert(kioskSchema).values(kioskData).returning())[0];
  await db
    .insert(kioskToSensorSchema)
    .values(sensorIds.map((sensorId) => ({ sensorId, kioskId: kiosk.id })));
};

const mapKioskToSensors = <D, T extends { kiosksToSensors: { sensor: D }[] }>(
  data?: T
): ({ sensors: T['kiosksToSensors'][0]['sensor'][] } & Omit<T, 'kiosksToSensors'>) | undefined => {
  if (!data) {
    return data;
  }

  const { kiosksToSensors, ...rest } = data;

  return { ...rest, sensors: kiosksToSensors.map(({ sensor }) => sensor) };
};

export const getKioskWithBme68xSensors = async (
  kioskUuid: string,
  options?: QueryDates & QueryLimit & QueryOrder
) => {
  const data = await db.query.kioskSchema.findFirst({
    where: eq(kioskSchema.kioskUuid, kioskUuid),
    with: {
      kiosksToSensors: {
        with: {
          sensor: {
            with: {
              bme68xData: {
                limit: options?.limit,
                orderBy: getSQLForOrder(bme68xDataSchema.createdAt, options?.order),
                where: getSQLForDates(bme68xDataSchema.createdAt, options?.dates)
              }
            }
          }
        }
      }
    },
    columns: { id: true, kioskUuid: true }
  });

  return mapKioskToSensors(data);
};

export const getKioskWithBme68xSensor = async (
  kioskUuid: string,
  sensorId: number,
  options?: QueryDates & QueryLimit & QueryOrder
) => {
  const data = await db.query.kioskSchema.findFirst({
    where: eq(kioskSchema.kioskUuid, kioskUuid),
    with: {
      kiosksToSensors: {
        where: eq(kioskToSensorSchema.sensorId, sensorId),
        with: {
          sensor: {
            with: {
              bme68xData: {
                limit: options?.limit,
                where: getSQLForDates(bme68xDataSchema.createdAt, options?.dates),
                orderBy: getSQLForOrder(bme68xDataSchema.createdAt, options?.order)
              }
            }
          }
        }
      }
    }
  });

  return mapKioskToSensors(data);
};

export const getKioskWithSensors = async (kioskUuid: string) =>
  mapKioskToSensors(
    await db.query.kioskSchema.findFirst({
      where: eq(kioskSchema.kioskUuid, kioskUuid),
      with: { kiosksToSensors: { with: { sensor: true } } }
    })
  );
