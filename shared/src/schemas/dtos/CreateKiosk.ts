import { InferType, array, number, object } from 'yup';

export const createKioskBodySchema = object({
  sensors: array().required().of(number().required())
});

export type CreateKioskRequest = InferType<typeof createKioskBodySchema>;

export interface CreateKioskResponse {
  kioskUuid: string;
}
