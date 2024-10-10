import { redisClient } from '../db/redis';
import { KioskNotFound } from '../errors/KioskNotFound';
import { KioskWithoutCoordinates } from '../errors/KioskWithoutCoordinates';
import { SensorNotFound } from '../errors/SensorNotFound';
import type { CreateKioskInput, TimestampRangeQuery } from '../schemas';
import type { RedisCachedEntry } from '../types/RedisCachedEntry';
import type { WeatherApiResponse } from '../types/WeatherApiResponse';
import axios from 'axios';
import { addMinutes, fromUnixTime, isAfter } from 'date-fns';
import { PermissionDenied } from '../errors/PermissionDenied';
import { v4 as uuid } from 'uuid';
import {
  createKioskWithSensors,
  getKioskByUuid,
  getKioskWithBme68xSensor,
  getKioskWithBme68xSensors,
  getKioskWithSensors
} from '../repositories/kiosk';
import { getSensorsWithIds } from '../repositories/sensor';
import type { userSchema } from '../db/drizzle/schema';

const FORECAST_CACHE_MINUTES = 30;

const { OPEN_WEATHER_API_KEY } = process.env;
if (!OPEN_WEATHER_API_KEY) {
  throw new Error('Missing OPEN_WEATHER_API_KEY env variable!');
}

const getForecast = async (kioskUuid: string): Promise<WeatherApiResponse> => {
  const kiosk = await getKioskByUuid(kioskUuid);

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

export const KioskService = {
  getKioskSensorData: async (kioskUuid: string, sensorId: number, dates?: TimestampRangeQuery) => {
    const kiosk = await getKioskWithBme68xSensor(kioskUuid, sensorId, { dates });

    if (!kiosk) {
      throw KioskNotFound();
    }

    const sensor = kiosk.sensors[0];
    if (!sensor) {
      throw SensorNotFound(sensorId);
    }

    return sensor;
  },

  getKioskForecast: async (kioskUuid: string) => {
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
  },

  getKiosk: async (kioskUuid: string) => {
    const kiosk = await getKioskWithSensors(kioskUuid);

    if (!kiosk) {
      throw KioskNotFound();
    }

    return { ...kiosk };
  },

  getKioskData: async (kioskUuid: string) => {
    const kiosk = await getKioskWithBme68xSensors(kioskUuid, { limit: 1, order: 'desc' });

    if (!kiosk) {
      throw KioskNotFound();
    }

    const parsedKiosk = {
      ...kiosk,
      sensors: kiosk.sensors.map((sensor) => ({ ...sensor, currentData: sensor.bme68xData[0] }))
    };

    return parsedKiosk;
  },

  createKiosk: async (data: CreateKioskInput, user: typeof userSchema.$inferSelect) => {
    const sensors = await getSensorsWithIds([...new Set(data.sensors)]);

    const foundSensorsIds = sensors.map((sensor) => sensor.id);
    const missingSensor = data.sensors.find((id) => !foundSensorsIds.includes(id));

    if (missingSensor) {
      throw SensorNotFound(missingSensor);
    }

    if (!sensors.every((sensor) => sensor.ownerId === user.id)) {
      throw PermissionDenied();
    }

    const kioskUuid = uuid();

    await createKioskWithSensors({ kioskUuid, ownerId: user.id }, data.sensors);

    return { kioskUuid };
  }
};
