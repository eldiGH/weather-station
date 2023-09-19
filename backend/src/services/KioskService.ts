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
import { redisClient } from '../redis';
import axios from 'axios';
import { RedisCachedEntry, WeatherApiResponse } from '../types';
import {
  addMinutes,
  addSeconds,
  differenceInSeconds,
  fromUnixTime,
  isAfter,
  subMinutes
} from 'date-fns';
import { getWhereForDates } from '../helpers';

const FORECAST_CACHE_MINUTES = 30;

const DATA_REFRESH_PROBE_MINUTES = 30;
const DEFAULT_DATA_REFRESH_TIME = 1800;

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

const calculateKioskDataRefreshTimestamp = async (sensorIds: number[]): Promise<Date> => {
  const fromTimestamp = subMinutes(new Date(), DATA_REFRESH_PROBE_MINUTES);

  const dataEntries = await db.bME68XSensorData.findMany({
    where: {
      sensorId: { in: sensorIds },
      createdAt: { gte: fromTimestamp }
    },
    orderBy: { createdAt: 'desc' },
    select: { createdAt: true, sensorId: true },
    take: 2
  });

  const sensorsData: Record<number, { lastTimestamp: Date; time: number }> = {};
  for (const entry of dataEntries) {
    if (!sensorsData[entry.sensorId]) {
      sensorsData[entry.sensorId] = { lastTimestamp: entry.createdAt, time: -1 };
      continue;
    }

    sensorsData[entry.sensorId].time = differenceInSeconds(
      sensorsData[entry.sensorId].lastTimestamp,
      entry.createdAt
    );
  }

  let lowestTimeSensorData: { lastTimestamp: Date; time: number } | null = null;
  for (const sensorId in sensorsData) {
    if (!lowestTimeSensorData) {
      lowestTimeSensorData = sensorsData[sensorId];
      continue;
    }

    if (sensorsData[sensorId].time > 0 && sensorsData[sensorId].time < lowestTimeSensorData.time) {
      lowestTimeSensorData = sensorsData[sensorId];
    }
  }

  if (!lowestTimeSensorData) {
    return addSeconds(new Date(), DEFAULT_DATA_REFRESH_TIME);
  }

  const normalizedLowestTimeSeconds = lowestTimeSensorData.time + lowestTimeSensorData.time * 0.05;
  const secondsSinceLowestSensorData =
    (new Date().getTime() - lowestTimeSensorData.lastTimestamp.getTime()) / 1000;

  if (lowestTimeSensorData.time > secondsSinceLowestSensorData) {
    return addSeconds(lowestTimeSensorData.lastTimestamp, normalizedLowestTimeSeconds);
  }

  return addSeconds(new Date(), normalizedLowestTimeSeconds);
};

const getKioskData = async (kioskUuid: string) => {
  const kiosk = await db.kiosk.findUnique({
    where: { kioskUuid },
    include: { sensors: { include: { bme68XData: { take: 1, orderBy: { createdAt: 'desc' } } } } }
  });

  if (!kiosk) {
    throw KioskNotFound();
  }

  const nextRefreshTimestamp = await calculateKioskDataRefreshTimestamp(
    kiosk.sensors.map((s) => s.id)
  );

  return { ...kiosk, nextRefreshTimestamp };
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

const mapForecastResponseData = (forecast: WeatherApiResponse, nextRefreshTimestamp: Date) => {
  const { alerts, current, daily, hourly, minutely } = forecast;

  const currentDate = new Date();

  const filteredHours = hourly.filter((h) => isAfter(fromUnixTime(h.dt), currentDate));
  const filteredMinutes = minutely?.filter((m) => isAfter(fromUnixTime(m.dt), currentDate));

  return {
    alerts,
    current,
    daily,
    hourly: filteredHours,
    minutely: filteredMinutes,
    nextRefreshTimestamp
  };
};

const getKioskForecast = async (kioskUuid: string) => {
  const cacheKey = `kiosk-${kioskUuid}`;
  const redisCachedEntry = await redisClient.get(cacheKey);

  let cacheValid;

  if (!redisCachedEntry) {
    cacheValid = false;
  } else {
    const parsedCacheEntry = JSON.parse(redisCachedEntry) as RedisCachedEntry<WeatherApiResponse>;
    const timestamp = new Date(parsedCacheEntry.timestamp);
    const timestampValidTo = addMinutes(timestamp, FORECAST_CACHE_MINUTES);

    cacheValid = isAfter(timestampValidTo, new Date());
    if (cacheValid) {
      const nextRefreshTimestamp = addMinutes(timestampValidTo, FORECAST_CACHE_MINUTES * 0.05);
      return mapForecastResponseData(parsedCacheEntry.data, nextRefreshTimestamp);
    }
  }

  const timestamp = new Date();
  const timestampValidTo = addMinutes(timestamp, FORECAST_CACHE_MINUTES);

  const newForecast = await getForecast(kioskUuid);
  const newCacheEntry: RedisCachedEntry<WeatherApiResponse> = {
    timestamp: timestamp.toISOString(),
    data: newForecast
  };

  await redisClient.set(cacheKey, JSON.stringify(newCacheEntry));

  const nextRefreshTimestamp = addMinutes(timestampValidTo, FORECAST_CACHE_MINUTES * 0.05);
  return mapForecastResponseData(newForecast, nextRefreshTimestamp);
};

export const KioskService = { getKioskData, createKiosk, getKioskSensorData, getKioskForecast };
