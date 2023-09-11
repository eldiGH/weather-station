import { number, object, string } from 'yup';

export const getKioskSensorQuerySchema = object({
  kioskUuid: string().required().uuid(),
  sensorId: number().required().min(1)
});
