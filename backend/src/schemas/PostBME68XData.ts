import { InferType, number, object, string } from 'yup';

export const postBME68XDataSchema = object({
  secret: string().required().uuid(),
  temperature: number().required(),
  humidity: number().required().min(0),
  pressure: number().required().min(0),
  gasResistance: number().required().min(0),
  batteryPercentage: number().required().min(0)
});

export type PostBME68XDataRequest = InferType<typeof postBME68XDataSchema>;
