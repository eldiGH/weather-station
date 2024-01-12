import EventEmitter from 'events';
import { type GetBME68xData, getBME68xDataInputSchema } from '../schemas/bme68x';
import type { bme68xDataSchema } from '../db/drizzle/schema';

const ee = new EventEmitter();

enum EventType {
  NewSensorData = 'newSensorData'
}

const getEventName = (eventType: EventType, identifier: string | number) =>
  `${eventType}:${identifier}`;

export const emitNewSensorData = (id: number, data: typeof bme68xDataSchema.$inferSelect) => {
  ee.emit(getEventName(EventType.NewSensorData, id), data);
};

export const addNewSensorDataListener = (id: number, callback: (data: GetBME68xData) => void) => {
  const eventCallback = (data: typeof bme68xDataSchema.$inferSelect) => {
    const parsedData = getBME68xDataInputSchema.parse(data);
    callback(parsedData);
  };

  const eventName = getEventName(EventType.NewSensorData, id);

  ee.on(eventName, eventCallback);

  return () => {
    ee.off(eventName, eventCallback);
  };
};
