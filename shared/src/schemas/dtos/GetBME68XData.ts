import { BME68XSensorData } from '@prisma/client';
import { InferType, date, number, object } from 'yup';

export interface GetLatestBME68XDataEntryResponse {
  temperature: number;
  humidity: number;
  pressure: number;
  gasResistance: number;
  createdAt: Date;
}

export const getSensorDataParamsSchema = object({ sensorId: number().required().integer().min(0) });

export type GetSensorDataParams = InferType<typeof getSensorDataParamsSchema>;

export const getSensorDataQuerySchema = object({ from: date(), to: date() });

export type GetSensorDataQuery = InferType<typeof getSensorDataQuerySchema>;

export type GetBME68XDataResponse = GetLatestBME68XDataEntryResponse[];

export const getLatestBME68XDataEntryMapper = ({
  temperature,
  pressure,
  humidity,
  gasResistance,
  createdAt
}: BME68XSensorData) => ({ temperature, pressure, humidity, gasResistance, createdAt });
