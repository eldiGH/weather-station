import { BME68XSensorData } from '@prisma/client';
import { InferType, date, number, object } from 'yup';

export interface GetLatestBME68XDataEntryResponse {
  temperature: number;
  humidity: number;
  pressure: number;
  gasResistance: number;
  batteryPercentage: number;
  createdAt: Date;
}

export const getSensorDataParamsSchema = object({ sensorId: number().required().integer().min(0) });

export type GetSensorDataParams = InferType<typeof getSensorDataParamsSchema>;

export const getSensorDataQuerySchema = object({
  from: date(),
  to: date(),
  fromLastDays: number()
});

export type GetSensorDataQuery = InferType<typeof getSensorDataQuerySchema>;

export type GetBME68XDataResponse = GetLatestBME68XDataEntryResponse[];

export const getLatestBME68XDataEntryMapper = ({
  temperature,
  pressure,
  humidity,
  gasResistance,
  createdAt,
  batteryPercentage
}: BME68XSensorData): GetLatestBME68XDataEntryResponse => ({
  temperature,
  pressure,
  humidity,
  gasResistance,
  createdAt,
  batteryPercentage
});
