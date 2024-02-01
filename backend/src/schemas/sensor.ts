import { z } from 'zod';
import { getBME68xDataInputSchema } from './bme68x';
import { dateRangeQuerySchema } from './helpers';
import { createInsertSchema } from 'drizzle-zod';
import { sensorSchema } from '../db/drizzle/schema';

export const insertSensorSchema = createInsertSchema(sensorSchema);

export const getSensorOutputSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: insertSensorSchema.shape.type
});

export const getSensorWithCurrentDataSchema = getSensorOutputSchema.extend({
  currentData: getBME68xDataInputSchema.optional()
});

export const getSensorDataInputSchema = z.object({
  sensorId: z.number().min(1),
  dateRangeQuery: dateRangeQuerySchema
});

export const getSensorDataOutputSchema = z.array(getBME68xDataInputSchema);

export const createSensorInputSchema = z.object({
  name: z.string().min(3),
  type: insertSensorSchema.shape.type
});

export type CreateSensorInput = z.infer<typeof createSensorInputSchema>;
