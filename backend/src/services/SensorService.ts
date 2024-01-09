import { SensorType } from '@prisma/client';
import { db } from '../db/prisma';
import { SecretIsNotValid } from '../errors/SecretIsNotValid';
import { SensorDataNotFound } from '../errors/SensorDataNotFound';
import { SensorNotFound } from '../errors/SensorNotFound';
import { getWhereForDates } from '../helpers/dates';
import { DateRangeQuery } from '../schemas/helpers';
import { emitNewSensorData } from '../helpers/eventEmitter';
import { PostBME68XDataInput } from '../schemas/bme68x';

// const addNewSensor = async (data: CreateSensorRequest, user: User) => {
//   const existingSensor = await db.sensor.findFirst({ where: { name: data.name } });

//   if (existingSensor) {
//     throw SensorNameAlreadyUsed(data.name);
//   }

//   let secret: string;
//   const sensors = await db.sensor.findMany({ select: { secret: true } });

//   do {
//     secret = v4();
//   } while (sensors.some((sensor) => sensor.secret === secret));

//   await db.sensor.create({ data: { ...data, secret, ownerId: user.id } });

//   return secret;
// };

const addBME68XDataEntry = async ({ secret, ...data }: PostBME68XDataInput) => {
  const sensor = await db.sensor.findFirst({ where: { secret } });

  if (!sensor || sensor.type !== SensorType.BME68X) {
    throw SecretIsNotValid();
  }

  const newData = await db.bME68XSensorData.create({ data: { ...data, sensorId: sensor.id } });

  emitNewSensorData(sensor.id, newData);
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
  addBME68XDataEntry,
  getLatestBME68XDataEntry,
  getBME68XData
};
