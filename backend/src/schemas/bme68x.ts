import { z } from 'zod';

export const getBME68xDataSchema = z.object({
  temperature: z.number(),
  humidity: z.number(),
  pressure: z.number(),
  gasResistance: z.number(),
  batteryPercentage: z.number(),
  createdAt: z.date()
});

export type GetLatestBME68xDataEntryOutput = z.infer<typeof getBME68xDataSchema>;
