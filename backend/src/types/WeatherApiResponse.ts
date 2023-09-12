import { WeatherResponse } from 'shared';

export interface WeatherApiResponse extends WeatherResponse {
  lon: number;
  lat: number;
  timezone: string;
  timezone_offset: number;
}
