import { SensorType } from '@prisma/client';
import { db } from '../db';
import { SecretIsNotValid, SensorDataNotFound, SensorNameAlreadyUsed } from '../errors';
import { v4 } from 'uuid';
import { CreateSensorRequest, PostBME68XDataRequest } from 'shared';

const addNewSensor = async (data: CreateSensorRequest) => {
  const existingSensor = await db.sensor.findFirst({ where: { name: data.name } });

  if (existingSensor) {
    throw SensorNameAlreadyUsed(data.name);
  }

  let secret: string;
  const sensors = await db.sensor.findMany({ select: { secret: true } });

  do {
    secret = v4();
  } while (sensors.some((sensor) => sensor.secret === secret));

  await db.sensor.create({ data: { ...data, secret } });

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
  const data = await db.bME68XSensorData.findFirst({
    where: { sensorId },
    orderBy: { createdAt: 'desc' }
  });

  if (!data) {
    throw SensorDataNotFound();
  }

  return data;
};

export const SensorService = { addNewSensor, addBME68XDataEntry, getLatestBME68XDataEntry };
