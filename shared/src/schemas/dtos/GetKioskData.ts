import { BME68XSensorData, Kiosk, Sensor } from '@prisma/client';
import { getLatestBME68XDataEntryMapper } from './GetBME68XData';
import { SensorResponseWithCurrentData } from './GetSensor';
import { object, string } from 'yup';

export const getKioskDataParamsSchema = object({
  kioskUuid: string().required().uuid()
});

export interface KioskDataResponse {
  sensors: SensorResponseWithCurrentData[];
}

export const kioskDataResponseMapper = (
  kiosk: Kiosk & {
    sensors: (Sensor & {
      bme68XData: BME68XSensorData[];
    })[];
  }
): KioskDataResponse => ({
  sensors: kiosk.sensors.map((sensor) => ({
    id: sensor.id,
    name: sensor.name,
    type: sensor.type,
    currentData: getLatestBME68XDataEntryMapper(sensor.bme68XData[0])
  }))
});
