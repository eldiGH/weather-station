import { SecretIsNotValid } from '../errors/SecretIsNotValid';
import { SensorDataNotFound } from '../errors/SensorDataNotFound';
import { SensorNotFound } from '../errors/SensorNotFound';
import type { DateRangeQuery } from '../schemas/helpers';
import { emitNewSensorData } from '../helpers/eventEmitter';
import type { PostBME68XDataInput } from '../schemas/bme68x';
import {
  createSensor,
  getAllSensorsSecrets,
  getSensorByName,
  getSensorBySecret,
  getSensorWithBme68xData
} from '../repositories/sensor';
import { createBme68xDataEntry } from '../repositories/bme68x';
import { v4 } from 'uuid';
import { SensorNameAlreadyUsed } from '../errors/SensorNameAlreadyUsed';
import type { CreateSensorInput } from '../schemas/sensor';
import type { userSchema } from '../db/drizzle/schema';

const addNewSensor = async (data: CreateSensorInput, user: typeof userSchema.$inferSelect) => {
  const existingSensor = await getSensorByName(data.name);

  if (existingSensor) {
    throw SensorNameAlreadyUsed(data.name);
  }

  let secret: string;
  const secrets = await getAllSensorsSecrets();

  do {
    secret = v4();
  } while (secrets.some((usedSecret) => usedSecret === secret));

  await createSensor({ ...data, secret, ownerId: user.id });

  return secret;
};

const addBME68XDataEntry = async ({ secret, ...data }: PostBME68XDataInput) => {
  const sensor = await getSensorBySecret(secret);

  if (!sensor || sensor.type !== 'BME68X') {
    throw SecretIsNotValid();
  }

  const newData = (await createBme68xDataEntry({ ...data, sensorId: sensor.id }).returning())[0];

  emitNewSensorData(sensor.id, newData);
};

const getLatestBME68XDataEntry = async (sensorId: number) => {
  const sensor = await getSensorWithBme68xData(sensorId, { limit: 1 });

  if (!sensor) {
    throw SensorNotFound(sensorId);
  }

  if (sensor.bme68xData.length === 0) {
    throw SensorDataNotFound();
  }

  return sensor.bme68xData[0];
};

const getBME68XData = async (sensorId: number, query: DateRangeQuery) => {
  const sensor = await getSensorWithBme68xData(sensorId, { dates: query });

  if (!sensor) {
    throw SensorNotFound(sensorId);
  }

  return sensor.bme68xData;
};

export const SensorService = {
  addBME68XDataEntry,
  getLatestBME68XDataEntry,
  getBME68XData,
  addNewSensor
};
