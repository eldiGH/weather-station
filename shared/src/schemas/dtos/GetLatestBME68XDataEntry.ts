import { BME68XSensorData } from '@prisma/client';

export interface GetLatestBME68XDataEntryResponse {
  temperature: number;
  humidity: number;
  pressure: number;
  gasResistance: number;
}

export const getLatestBME68XDataEntryMapper = ({
  temperature,
  pressure,
  humidity,
  gasResistance
}: BME68XSensorData) => ({ temperature, pressure, humidity, gasResistance });
