import { BME68XSensorData, Sensor, SensorType } from '@prisma/client';
import { GetLatestBME68XDataEntryResponse, getLatestBME68XDataEntryMapper } from './GetBME68XData';

export interface SensorResponse {
  id: number;
  name: string;
  type: SensorType;
}

export interface SensorResponseWithCurrentData extends SensorResponse {
  currentData: GetLatestBME68XDataEntryResponse | undefined;
}

export interface SensorResponseWithData extends SensorResponse {
  data: GetLatestBME68XDataEntryResponse[];
}

export const sensorResponseWithDataMapper = ({
  id,
  name,
  type,
  bme68XData
}: Sensor & {
  bme68XData: BME68XSensorData[];
}): SensorResponseWithData => ({
  id,
  name,
  type,
  data: bme68XData.map(getLatestBME68XDataEntryMapper)
});
