import { z } from 'zod';
import { getSensorWithCurrentDataSchema } from './sensor';
import { dateRangeQuerySchema } from './helpers';

export const getKioskDataInputSchema = z.object({
  kioskUuid: z.string().uuid()
});

export const subscribeKioskInputSchema = z.object({
  kioskUuid: z.string().uuid()
});

export const getKioskDataOutputSchema = z.object({
  sensors: z.array(getSensorWithCurrentDataSchema)
});

export const getForecastForKioskInputSchema = z.object({
  kioskUuid: z.string().uuid()
});

export const getKioskSensorDetailsInputSchema = z.object({
  kioskUuid: z.string().uuid(),
  sensorId: z.number().min(1),
  dateRangeQuery: dateRangeQuerySchema
});

export const createKioskInputSchema = z.object({
  sensors: z.array(z.number())
});

export type CreateKioskInput = z.infer<typeof createKioskInputSchema>;
