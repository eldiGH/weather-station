import { z } from 'zod';

export const dateRangeQuerySchema = z
  .object({
    from: z.date().optional(),
    to: z.date().optional(),
    fromLastDays: z.number().optional()
  })
  .optional();

export type DateRangeQuery = z.infer<typeof dateRangeQuerySchema>;
