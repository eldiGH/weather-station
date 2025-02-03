import { z } from 'zod';

export const MAX_SENSORS_FIELDS = 30;

export const createSensorInputSchema = z.object({
  name: z.string().min(3),
  templateId: z.number().int().nonnegative()
});
export type CreateSensorInput = z.infer<typeof createSensorInputSchema>;

export const sensorTemplateField = z.object({
  propertyName: z.string().min(1).max(100),
  isOptional: z.boolean(),
  type: z.enum(['text', 'integer', 'doublePrecision', 'boolean']),
  label: z.string().min(1).max(100).optional()
});

export const createSensorTemplateSchema = z.object({
  name: z.string().min(3).max(30),
  isPublic: z.boolean().optional(),
  fields: z.array(sensorTemplateField).min(1).max(MAX_SENSORS_FIELDS)
});
export type CreateSensorTemplateInput = z.infer<typeof createSensorTemplateSchema>;

export const createSensorTemplateFormSchema = createSensorTemplateSchema.extend({
  fields: z
    .array(
      sensorTemplateField.extend({
        uuid: z.string().uuid()
      })
    )
    .min(1)
    .max(MAX_SENSORS_FIELDS)
});
export type CreateSensorTemplateFormInput = z.infer<typeof createSensorTemplateFormSchema>;

export const sensorDataItemSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
export type SensorDataItem = z.infer<typeof sensorDataItemSchema>;

export const postSensorDataSchema = z.record(sensorDataItemSchema);
export type PostSensorDataInput = z.infer<typeof postSensorDataSchema>;
