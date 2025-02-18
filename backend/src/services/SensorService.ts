import { v4 } from 'uuid';
import { SensorNameAlreadyUsed } from '../errors/SensorNameAlreadyUsed';
import type {
  CreateSensorInput,
  CreateSensorTemplateInput,
  EditSensorInput,
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
import { and, eq, or, sql } from 'drizzle-orm';
import { SensorTemplateNotFound } from '../errors/SensorTemplateNotFound';
import { SecretIsNotValid } from '../errors/SecretIsNotValid';
import { SensorDataFieldMissing } from '../errors/SensorDataFieldMissing';
import { SensorDataFieldInvalidType } from '../errors/SensorDataFieldInvalidType';
import { SensorNotFound } from '../errors/SensorNotFound';

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

    await db.insert(sensorSchema).values({ name, secret, ownerId: user.id, templateId });

    return Ok(secret);
  },

  editSensor: async (data: EditSensorInput, user: typeof userSchema.$inferSelect) => {
    const { id, name, templateId } = data;

    const sensor = await db.query.sensorSchema.findFirst({
      where: and(eq(sensorSchema.id, id), eq(sensorSchema.ownerId, user.id))
    });

    if (!sensor) {
      return Err(SensorNotFound(id));
    }

    if (data.templateId !== sensor.templateId) {
      const sensorTemplate = await db.query.sensorTemplateSchema.findFirst({
        where: and(
          eq(sensorTemplateSchema.id, templateId),
          or(eq(sensorTemplateSchema.authorId, user.id), eq(sensorTemplateSchema.isPublic, true))
        )
      });

      if (!sensorTemplate) {
        return Err(SensorTemplateNotFound(templateId));
      }
    }

    await db.update(sensorSchema).set({ name, templateId }).where(eq(sensorSchema.id, id));

    return Ok();
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
      return Err(SensorTemplateNotFound(sensor.templateId ?? -1));
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
        case 'number':
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
      }

      parsedSensorData.push(parsedValue);
    }

    await db.insert(sensorDataSchema).values({
      sensorId: sensor.id,
      data: parsedSensorData
    });

    return Ok();
  },

  getSensorTemplates: async (user: typeof userSchema.$inferSelect) =>
    Ok(
      await db
        .select({ id: sensorTemplateSchema.id, name: sensorTemplateSchema.name })
        .from(sensorTemplateSchema)
        .where(
          or(eq(sensorTemplateSchema.authorId, user.id), eq(sensorTemplateSchema.isPublic, true))
        )
        .orderBy(sql`CASE WHEN ${sensorTemplateSchema.authorId} = ${user.id} THEN 0 ELSE 1 END`)
    ),

  getSensors: async (user: typeof userSchema.$inferSelect) => {
    const sensors = await db.query.sensorSchema.findMany({
      where: eq(sensorSchema.ownerId, user.id),
      orderBy: (sensor, { asc }) => [asc(sensor.id)],
      with: {
        data: { limit: 1, orderBy: (data, { desc }) => [desc(data.createdAt)] }
      }
    });

    return Ok(sensors.map(({ data, ...sensor }) => ({ ...sensor, lastData: data[0] ?? null })));
  }
};
