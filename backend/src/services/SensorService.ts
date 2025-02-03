import { v4 } from 'uuid';
import { SensorNameAlreadyUsed } from '../errors/SensorNameAlreadyUsed';
import type {
  CreateSensorInput,
  CreateSensorTemplateInput,
  PostSensorDataInput
} from '../schemas/sensor';
import {
  sensorDataSchema,
  sensorSchema,
  sensorTemplateSchema,
  type userSchema
} from '../db/drizzle/schema';
import { Err, Ok } from '../helpers/control';
import { db } from '../db/drizzle';
import { eq } from 'drizzle-orm';
import { SensorTemplateNotFound } from '../errors/SensorTemplateNotFound';
import { SecretIsNotValid } from '../errors/SecretIsNotValid';
import { SensorDataFieldMissing } from '../errors/SensorDataFieldMissing';
import { SensorDataFieldInvalidType } from '../errors/SensorDataFieldInvalidType';

export const SensorService = {
  addNewSensor: async (data: CreateSensorInput, user: typeof userSchema.$inferSelect) => {
    const { name, templateId } = data;

    const sensorTemplate = (
      await db.select().from(sensorTemplateSchema).where(eq(sensorTemplateSchema.id, templateId))
    ).shift();
    if (!sensorTemplate) {
      return Err(SensorTemplateNotFound(templateId));
    }

    const existingSensor = (
      await db.select().from(sensorSchema).where(eq(sensorSchema.name, name))
    ).shift();

    if (existingSensor) {
      return Err(SensorNameAlreadyUsed(name));
    }

    let secret: string;
    let existingSecret;

    do {
      secret = v4();

      existingSecret = (
        await db.select().from(sensorSchema).where(eq(sensorSchema.secret, secret))
      ).shift();
    } while (existingSecret);

    await db
      .insert(sensorSchema)
      .values({ name, secret, ownerId: user.id, sensorTemplateId: templateId });

    return Ok(secret);
  },

  createSensorTemplate: async (
    template: CreateSensorTemplateInput,
    user: typeof userSchema.$inferSelect
  ) => {
    await db.insert(sensorTemplateSchema).values({ ...template, authorId: user.id });

    return Ok();
  },

  postSensorData: async (sensorSecret: string, data: PostSensorDataInput) => {
    const sensor = await db.query.sensorSchema.findFirst({
      where: eq(sensorSchema.secret, sensorSecret),
      with: { sensorTemplate: true }
    });

    if (!sensor) {
      return Err(SecretIsNotValid());
    }

    const parsedSensorData = [];

    // TODO: remove that if when notNull will be added to schema
    if (!sensor.sensorTemplate) {
      return Err(SensorTemplateNotFound(sensor.sensorTemplateId ?? -1));
    }

    for (const field of sensor.sensorTemplate.fields) {
      const value = data[field.propertyName];

      if (value === undefined || value === null) {
        if (!field.isOptional) {
          return Err(SensorDataFieldMissing(field.propertyName));
        }

        parsedSensorData.push(null);
        continue;
      }

      let parsedValue = value;

      switch (field.type) {
        case 'boolean':
          if (typeof value !== 'boolean') {
            return Err(SensorDataFieldInvalidType(field.propertyName, field.type));
          }
          break;
        case 'text':
          if (typeof value !== 'string') {
            return Err(SensorDataFieldInvalidType(field.propertyName, field.type));
          }
          break;
        case 'integer':
        case 'doublePrecision':
          if (typeof value === 'string') {
            parsedValue = Number(value);
            if (Number.isNaN(parsedValue)) {
              return Err(SensorDataFieldInvalidType(field.propertyName, field.type));
            }
          } else if (typeof value !== 'number') {
            return Err(SensorDataFieldInvalidType(field.propertyName, field.type));
          } else {
            parsedValue = value;
          }

          if (field.type === 'integer') {
            parsedValue = Math.round(parsedValue);
          }
      }

      parsedSensorData.push(parsedValue);
    }

    await db.insert(sensorDataSchema).values({
      sensorId: sensor.id,
      data: parsedSensorData
    });

    return Ok();
  }
};
