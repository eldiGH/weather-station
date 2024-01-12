import { SecretIsNotValid } from '../errors/SecretIsNotValid';
import { SensorDataNotFound } from '../errors/SensorDataNotFound';
import { SensorNotFound } from '../errors/SensorNotFound';
import { DateRangeQuery } from '../schemas/helpers';
import { emitNewSensorData } from '../helpers/eventEmitter';
import { PostBME68XDataInput } from '../schemas/bme68x';
import { bme68xDataSchema, db } from '../db/drizzle';
import { getSensorBySecret, getSensorWithBme68xData } from '../repositories/sensor';

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
  const sensor = await getSensorBySecret(secret);

  if (!sensor || sensor.type !== 'BME68X') {
    throw SecretIsNotValid();
  }

  const newData = (await db.insert(bme68xDataSchema).values({ ...data, sensorId: sensor.id }))[0];

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
  getBME68XData
};
