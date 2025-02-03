import { v4 } from 'uuid';
import { SensorNameAlreadyUsed } from '../errors/SensorNameAlreadyUsed';
import type { CreateSensorInput, CreateSensorTemplateInput } from '../schemas/sensor';
import { sensorSchema, sensorTemplateSchema, type userSchema } from '../db/drizzle/schema';
import { Err, Ok } from '../helpers/control';
import { db } from '../db/drizzle';
import { eq } from 'drizzle-orm';
import { SensorTemplateNotFound } from '../errors/SensorTemplateNotFound';

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
  }
};
