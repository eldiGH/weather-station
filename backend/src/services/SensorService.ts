import { BME68XSensorData, SensorType } from '@prisma/client';
import { db } from '../db';
import {
  SecretIsNotValid,
  SensorDataNotFound,
  SensorNameAlreadyUsed,
  SensorNotFound
} from '../errors';
import { v4 } from 'uuid';
import { CreateSensorRequest, GetSensorDataQuery, PostBME68XDataRequest } from 'shared';

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
  const { from, to } = query;

  const sensor = await db.sensor.findFirst({
    where: { id: sensorId }
  });

  if (!sensor) {
    throw SensorNotFound(sensorId);
  }

  let data: BME68XSensorData[];

  if (from && to) {
    data = await db.bME68XSensorData.findMany({
      where: { sensorId, AND: [{ createdAt: { gte: from } }, { createdAt: { lte: to } }] }
    });
  } else if (from) {
    data = await db.bME68XSensorData.findMany({ where: { sensorId, createdAt: { gte: from } } });
  } else if (to) {
    data = await db.bME68XSensorData.findMany({ where: { sensorId, createdAt: { lte: from } } });
  } else {
    data = await db.bME68XSensorData.findMany({ where: { sensorId } });
  }

  return data;
};

export const SensorService = {
  addNewSensor,
  addBME68XDataEntry,
  getLatestBME68XDataEntry,
  getBME68XData
};
