import { z } from 'zod';

export const getBME68xDataSchema = z.object({
  temperature: z.number(),
  humidity: z.number(),
  pressure: z.number(),
  gasResistance: z.number(),
  batteryPercentage: z.number(),
  createdAt: z.date()
});

export type GetBME68xData = z.infer<typeof getBME68xDataSchema>;

export type SubscribeBME68xData = GetBME68xData & { sensorId: number };
