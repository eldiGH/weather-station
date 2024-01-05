import { SensorType, User } from '@prisma/client';
import { v4 } from 'uuid';
import { db } from '../db/prisma';
import { SecretIsNotValid } from '../errors/SecretIsNotValid';
import { SensorDataNotFound } from '../errors/SensorDataNotFound';
import { SensorNameAlreadyUsed } from '../errors/SensorNameAlreadyUsed';
import { SensorNotFound } from '../errors/SensorNotFound';
import { getWhereForDates } from '../helpers/dates';
import { CreateSensorRequest } from '../schemas/CreateSensor';
import { PostBME68XDataRequest } from '../schemas/PostBME68XData';
import { DateRangeQuery } from '../schemas/helpers';

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

const getBME68XData = async (sensorId: number, query: DateRangeQuery) => {
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
