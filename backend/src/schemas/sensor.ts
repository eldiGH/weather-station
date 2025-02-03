import { z } from 'zod';

export const createSensorInputSchema = z.object({
  name: z.string().min(3),
  templateId: z.number().int().nonnegative()
});
export type CreateSensorInput = z.infer<typeof createSensorInputSchema>;

export const createSensorTemplateSchema = z.object({
  name: z.string().min(3).max(30),
  fields: z
    .array(
      z.object({
        propertyName: z.string().min(1).max(100),
        isOptional: z.boolean(),
        type: z.enum(['text', 'integer', 'doublePrecision', 'boolean']),
        isPublic: z.boolean().optional()
      })
    )
    .min(1)
    .max(50)
});

export type CreateSensorTemplateInput = z.infer<typeof createSensorTemplateSchema>;
