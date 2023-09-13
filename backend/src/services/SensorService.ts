import { SensorType, User } from '@prisma/client';
import { db } from '../db';
import {
  SecretIsNotValid,
  SensorDataNotFound,
  SensorNameAlreadyUsed,
  SensorNotFound
} from '../errors';
import { v4 } from 'uuid';
import { CreateSensorRequest, GetSensorDataQuery, PostBME68XDataRequest } from 'shared';
import { getWhereForDates } from '../helpers/dates';

const addNewSensor = async (data: CreateSensorRequest, user: User) => {
  const existingSensor = await db.sensor.findFirst({ where: { name: data.name } });

  if (existingSensor) {
    throw SensorNameAlreadyUsed(data.name);
  }

  let secret: string;
  const sensors = await db.sensor.findMany({ select: { secret: true } });

  do {
    secret = v4();
  } while (sensors.some((sensor) => sensor.secret === secret));

  await db.sensor.create({ data: { ...data, secret, ownerId: user.id } });

  return secret;
};

const addBME68XDataEntry = async ({ secret, ...data }: PostBME68XDataRequest) => {
  const sensor = await db.sensor.findFirst({ where: { secret } });

  if (!sensor || sensor.type !== SensorType.BME68X) {
    throw SecretIsNotValid();
  }

  await db.bME68XSensorData.create({ data: { ...data, sensorId: sensor.id } });
};

const getLatestBME68XDataEntry = async (sensorId: number) => {
  const sensor = await db.sensor.findFirst({
    where: { id: sensorId },
    include: { bme68XData: { orderBy: { createdAt: 'desc' }, take: 1 } }
  });

  if (!sensor) {
    throw SensorNotFound(sensorId);
  }

  if (sensor.bme68XData.length === 0) {
    throw SensorDataNotFound();
  }

  return sensor.bme68XData[0];
};

const getBME68XData = async (sensorId: number, query: GetSensorDataQuery) => {
  const sensor = await db.sensor.findFirst({
    where: { id: sensorId }
  });

  if (!sensor) {
    throw SensorNotFound(sensorId);
  }

  return await db.bME68XSensorData.findMany({
    where: { ...getWhereForDates('createdAt', query), sensorId },
    orderBy: { createdAt: 'asc' }
  });
};

export const SensorService = {
  addNewSensor,
  addBME68XDataEntry,
  getLatestBME68XDataEntry,
  getBME68XData
};
