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
import { Err, Ok } from '../helpers/control';

const FORECAST_CACHE_MINUTES = 30;

const { OPEN_WEATHER_API_KEY } = process.env;
if (!OPEN_WEATHER_API_KEY) {
  throw new Error('Missing OPEN_WEATHER_API_KEY env variable!');
}

const getForecast = async (kioskUuid: string) => {
  const kiosk = await getKioskByUuid(kioskUuid);

  if (!kiosk) {
    return Err(KioskNotFound());
  }

  const { latitude, longitude } = kiosk;

  if (!latitude || !longitude) {
    return Err(KioskWithoutCoordinates());
  }

  const response = await axios.get<WeatherApiResponse>(
    `https://api.openweathermap.org/data/3.0/onecall`,
    {
      responseType: 'json',
      params: {
        lat: latitude,
        lon: longitude,
        appid: OPEN_WEATHER_API_KEY,
        lang: 'pl',
        units: 'metric'
      }
    }
  );

  return Ok(response.data);
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
      return Err(KioskNotFound());
    }

    const sensor = kiosk.sensors[0];
    if (!sensor) {
      return Err(SensorNotFound(sensorId));
    }

    return Ok(sensor);
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
        return Ok(mapForecastResponseData(parsedCacheEntry.data, nextRefreshTimestamp));
      }
    }

    const timestamp = new Date();
    const timestampValidTo = addMinutes(timestamp, FORECAST_CACHE_MINUTES);

    const { data: newForecast, error } = await getForecast(kioskUuid);
    if (error) {
      return Err(error);
    }

    const newCacheEntry: RedisCachedEntry<WeatherApiResponse> = {
      timestamp: timestamp.toISOString(),
      data: newForecast
    };

    await redisClient.set(cacheKey, JSON.stringify(newCacheEntry));

    const nextRefreshTimestamp = addMinutes(timestampValidTo, FORECAST_CACHE_MINUTES * 0.05);
    return Ok(mapForecastResponseData(newForecast, nextRefreshTimestamp));
  },

  getKiosk: async (kioskUuid: string) => {
    const kiosk = await getKioskWithSensors(kioskUuid);

    if (!kiosk) {
      return Err(KioskNotFound());
    }

    return Ok({ ...kiosk });
  },

  getKioskData: async (kioskUuid: string) => {
    const kiosk = await getKioskWithBme68xSensors(kioskUuid, { limit: 1, order: 'desc' });

    if (!kiosk) {
      return Err(KioskNotFound());
    }

    const parsedKiosk = {
      ...kiosk,
      sensors: kiosk.sensors.map((sensor) => ({ ...sensor, currentData: sensor.bme68xData[0] }))
    };

    return Ok(parsedKiosk);
  },

  createKiosk: async (data: CreateKioskInput, user: typeof userSchema.$inferSelect) => {
    const sensors = await getSensorsWithIds([...new Set(data.sensors)]);

    const foundSensorsIds = sensors.map((sensor) => sensor.id);
    const missingSensor = data.sensors.find((id) => !foundSensorsIds.includes(id));

    if (missingSensor) {
      return Err(SensorNotFound(missingSensor));
    }

    if (!sensors.every((sensor) => sensor.ownerId === user.id)) {
      return Err(PermissionDenied());
    }

    const kioskUuid = uuid();

    await createKioskWithSensors({ kioskUuid, ownerId: user.id }, data.sensors);

    return Ok({ kioskUuid });
  }
};
