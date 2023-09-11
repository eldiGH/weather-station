import { User } from '@prisma/client';
import { db } from '../db';
import { KioskNotFound, PermissionDenied, SensorNotFound } from '../errors';
import { CreateKioskRequest, CreateKioskResponse, GetSensorDataQuery } from 'shared';
import { v4 as uuid } from 'uuid';
import { getWhereForDates } from '../helpers/dates.';

const createKiosk = async (data: CreateKioskRequest, user: User): Promise<CreateKioskResponse> => {
  const sensors = await db.sensor.findMany({
    where: { id: { in: Array.from(new Set(data.sensors)) } }
  });

  const foundSensorsIds = sensors.map((sensor) => sensor.id);
  const missingSensor = data.sensors.find((id) => !foundSensorsIds.includes(id));

  if (missingSensor) {
    throw SensorNotFound(missingSensor);
  }

  if (!sensors.every((sensor) => sensor.ownerId === user.id)) {
    throw PermissionDenied();
  }

  const kioskUuid = uuid();

  await db.kiosk.create({
    data: {
      kioskUuid,
      ownerId: user.id,
      sensors: { connect: sensors.map(({ id }) => ({ id })) }
    }
  });

  return { kioskUuid };
};

const getKioskData = async (kioskUuid: string) => {
  const kiosk = await db.kiosk.findUnique({
    where: { kioskUuid },
    include: { sensors: { include: { bme68XData: { take: 1, orderBy: { createdAt: 'desc' } } } } }
  });

  if (!kiosk) {
    throw KioskNotFound();
  }

  return kiosk;
};

const getKioskSensorData = async (
  kioskUuid: string,
  sensorId: number,
  query: GetSensorDataQuery
) => {
  const kiosk = await db.kiosk.findUnique({
    where: { kioskUuid },
    include: {
      sensors: {
        where: { id: sensorId },
        include: {
          bme68XData: {
            orderBy: { createdAt: 'asc' },
            where: getWhereForDates('createdAt', query)
          }
        }
      }
    }
  });

  if (!kiosk) {
    throw KioskNotFound();
  }

  const sensor = kiosk.sensors[0];
  if (!sensor) {
    throw SensorNotFound(sensorId);
  }

  return sensor;
};

export const KioskService = { getKioskData, createKiosk, getKioskSensorData };
