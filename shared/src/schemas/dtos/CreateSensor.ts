import { SensorType } from '@prisma/client';
import { InferType, object, string } from 'yup';

export const createSensorSchema = object({
  name: string().required().max(50),
  type: string().required().oneOf(Object.values(SensorType))
});

export type CreateSensorRequest = InferType<typeof createSensorSchema>;
