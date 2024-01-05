import { z } from 'zod';

export const createKioskInputSchema = z.object({
  sensors: z.array(z.number())
});

export interface CreateKioskOutput {
  kioskUuid: string;
}
