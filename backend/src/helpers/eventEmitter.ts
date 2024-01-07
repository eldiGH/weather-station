import EventEmitter from 'events';
import { GetBME68xData, getBME68xDataSchema } from '../schemas/bme68x';
import { BME68XSensorData } from '@prisma/client';

const ee = new EventEmitter();

enum EventType {
  NewSensorData = 'newSensorData'
}

const getEventName = (eventType: EventType, identifier: string | number) =>
  `${eventType}:${identifier}`;

export const emitNewSensorData = (id: number, data: BME68XSensorData) => {
  ee.emit(getEventName(EventType.NewSensorData, id), data);
};

export const addNewSensorDataListener = (id: number, callback: (data: GetBME68xData) => void) => {
  const eventCallback = (data: BME68XSensorData) => {
    const parsedData = getBME68xDataSchema.parse(data);
    callback(parsedData);
  };

  const eventName = getEventName(EventType.NewSensorData, id);

  ee.on(eventName, eventCallback);

  return () => {
    ee.off(eventName, eventCallback);
  };
};
