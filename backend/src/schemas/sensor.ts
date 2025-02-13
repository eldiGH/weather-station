import { z } from 'zod';

export const MAX_SENSORS_FIELDS = 30;

export const createSensorInputSchema = z.object({
  name: z.string().min(3),
  templateId: z.number().int().nonnegative()
});
export type CreateSensorInput = z.infer<typeof createSensorInputSchema>;

export const sensorTemplateFieldTypeSchema = z.enum(['text', 'number', 'boolean']);
export type SensorTemplateFieldType = z.infer<typeof sensorTemplateFieldTypeSchema>;

export const sensorTemplateField = z.object({
  propertyName: z
    .string()
    .min(1)
    .max(100)
    .refine((name) => name !== 'sensorSecret', { message: "Field name cannot be 'sensorSecret'" }),
  isOptional: z.boolean(),
  type: sensorTemplateFieldTypeSchema,
  label: z.string().min(1).max(100).nullable()
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

export const sensorDataOutputSchema = z.object({
  createdAt: z.date(),
  data: z.array(sensorDataItemSchema)
});

export const sensorOutputSchema = z.object({
  id: z.number(),
  name: z.string(),
  sensorTemplateId: z.number().int().nonnegative().nullable(),
  lastData: sensorDataOutputSchema.nullable(),
  secret: z.string()
});
