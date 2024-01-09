import { SensorType } from '@prisma/client';
import { z } from 'zod';
import { getBME68xDataInputSchema } from './bme68x';
import { dateRangeQuerySchema } from './helpers';

export const getSensorOutputSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.nativeEnum(SensorType)
});

export const getSensorWithCurrentDataSchema = getSensorOutputSchema.extend({
  currentData: getBME68xDataInputSchema.optional()
});

export const getSensorDataInputSchema = z.object({
  sensorId: z.number().min(1),
  dateRangeQuery: dateRangeQuerySchema
});

export const getSensorDataOutputSchema = z.array(getBME68xDataInputSchema);
