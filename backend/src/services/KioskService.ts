import { User } from '@prisma/client';
import { db } from '../db';
import {
  KioskNotFound,
  KioskWithoutCoordinates,
  PermissionDenied,
  SensorNotFound
} from '../errors';
import { CreateKioskRequest, CreateKioskResponse, GetSensorDataQuery } from 'shared';
import { v4 as uuid } from 'uuid';
import { getWhereForDates } from '../helpers/dates.';
import { redisClient } from '../redis';
import axios from 'axios';
import { RedisCachedEntry, WeatherApiResponse } from '../types';
import { addMinutes, isAfter } from 'date-fns';

const FORECAST_CACHE_MINUTES = 30;

const { OPEN_WEATHER_API_KEY } = process.env;
if (!OPEN_WEATHER_API_KEY) {
  throw new Error('Missing OPEN_WEATHER_API_KEY env variable!');
}

const getForecast = async (kioskUuid: string): Promise<WeatherApiResponse> => {
  const kiosk = await db.kiosk.findUnique({ where: { kioskUuid } });

  if (!kiosk) {
    throw KioskNotFound;
  }

  const { latitude, longitude } = kiosk;

  if (!latitude || !longitude) {
    throw KioskWithoutCoordinates();
  }

  return (
    await axios.get(`https://api.openweathermap.org/data/3.0/onecall`, {
      responseType: 'json',
      params: {
        lat: latitude,
        lon: longitude,
        appid: OPEN_WEATHER_API_KEY,
        lang: 'pl',
        units: 'metric'
      }
    })
  ).data;
};

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

const removeForecastPrivateData = (forecast: WeatherApiResponse) => {
  // sourcery skip: inline-immediately-returned-variable
  const { alerts, current, daily, hourly, minutely } = forecast;

  return { alerts, current, daily, hourly, minutely };
};

const getKioskForecast = async (kioskUuid: string) => {
  const cacheKey = `kiosk-${kioskUuid}`;
  const redisCachedEntry = await redisClient.get(cacheKey);

  let cacheValid;

  if (!redisCachedEntry) {
    cacheValid = false;
  } else {
    const parsedCacheEntry = JSON.parse(redisCachedEntry) as RedisCachedEntry<WeatherApiResponse>;

    cacheValid = isAfter(
      addMinutes(new Date(parsedCacheEntry.timestamp), FORECAST_CACHE_MINUTES),
      new Date()
    );
    if (cacheValid) {
      return removeForecastPrivateData(parsedCacheEntry.data);
    }
  }

  const newForecast = await getForecast(kioskUuid);
  const newCacheEntry: RedisCachedEntry<WeatherApiResponse> = {
    timestamp: new Date().toISOString(),
    data: newForecast
  };

  await redisClient.set(cacheKey, JSON.stringify(newCacheEntry));

  return removeForecastPrivateData(newForecast);
};

export const KioskService = { getKioskData, createKiosk, getKioskSensorData, getKioskForecast };
