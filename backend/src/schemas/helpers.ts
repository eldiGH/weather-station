import { z } from 'zod';

export const timestampRangeQuerySchema = z
  .object({
    from: z.date().optional(),
    to: z.date().optional(),
    fromLastDays: z.number().optional()
  })
  .optional();

export type TimestampRangeQuery = z.infer<typeof timestampRangeQuerySchema>;

export const dateRangeQuerySchema = z.object({
  from: z.string().date().optional(),
  to: z.string().date().optional(),
  fromLastDays: z.number().optional()
});

export type DateRangeQuery = z.infer<typeof dateRangeQuerySchema>;
