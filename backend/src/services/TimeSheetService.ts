import { and, eq, inArray, sql } from 'drizzle-orm';
import { db } from '../db/drizzle';
import { timeSheetEntrySchema, timeSheetSchema, type UserModel } from '../db/drizzle/schema';
import type {
  CreateTimeSheetInput,
  DeleteTimeSheetEntryBulkInput,
  DeleteTimeSheetEntryInput,
  GetTimeSheetInput,
  SetTimeSheetEntryBulkInput,
  SetTimeSheetEntryInput
} from '../schemas/timeSheet';
import { TimeSheetNameAlreadyUsed } from '../errors/TimeSheetNameAlreadyUsed';
import { getSQLForDates } from '../helpers/db';
import { TimeSheetNotFound } from '../errors/TimeSheetNotFound';
import { AccessDenied } from '../errors/AccessDenied';
import { TimeSheetEntryNotFound } from '../errors/TimeSheetEntryNotFound';

const validateTimeSheet = <T extends typeof timeSheetSchema.$inferSelect>(
  timeSheet: T | undefined,
  user: UserModel
) => {
  if (!timeSheet) {
    throw TimeSheetNotFound();
  }

  if (timeSheet.ownerId !== user.id) {
    throw AccessDenied(`TimeSheet: ${timeSheet.id}`);
  }

  return timeSheet;
};

const getAndValidateTimeSheet = async (timeSheetId: string, user: UserModel) =>
  validateTimeSheet(
    (await db.select().from(timeSheetSchema).where(eq(timeSheetSchema.id, timeSheetId))).at(0),
    user
  );

export const TimeSheetService = {
  createTimeSheet: async (data: CreateTimeSheetInput, user: UserModel) => {
    const existingTimeSheetWithSameNameForUser = (
      await db.select().from(timeSheetSchema).where(eq(timeSheetSchema.ownerId, user.id))
    ).at(0);

    if (existingTimeSheetWithSameNameForUser) {
      throw TimeSheetNameAlreadyUsed(data.name);
    }

    await db.insert(timeSheetSchema).values({ ...data, ownerId: user.id });
  },

  getTimeSheet: async (data: GetTimeSheetInput, user: UserModel) => {
    const timeSheet = await db.query.timeSheetSchema.findFirst({
      where: (timeSheet, { eq }) => eq(timeSheet.id, data.id),
      with: {
        entries: {
          where: getSQLForDates(timeSheetEntrySchema.date, data.dates)
        }
      }
    });

    const { id, name, defaultPricePerHour, createdAt, entries } = validateTimeSheet(
      timeSheet,
      user
    );

    return {
      id,
      name,
      defaultPricePerHour,
      createdAt,
      entries: entries.map(({ date, hours, pricePerHour, createdAt }) => ({
        date,
        hours,
        pricePerHour,
        createdAt
      }))
    };
  },

  setTimeSheetEntry: async (input: SetTimeSheetEntryInput, user: UserModel) => {
    await getAndValidateTimeSheet(input.timeSheetId, user);

    await db
      .insert(timeSheetEntrySchema)
      .values(input)
      .onConflictDoUpdate({
        target: [timeSheetEntrySchema.date, timeSheetEntrySchema.timeSheetId],
        set: { hours: input.hours, pricePerHour: input.pricePerHour }
      });
  },

  setTimeSheetEntryBulk: async (input: SetTimeSheetEntryBulkInput, user: UserModel) => {
    await getAndValidateTimeSheet(input.timeSheetId, user);

    await db
      .insert(timeSheetEntrySchema)
      .values(input.entries.map((entry) => ({ ...entry, timeSheetId: input.timeSheetId })))
      .onConflictDoUpdate({
        target: [timeSheetEntrySchema.date, timeSheetEntrySchema.timeSheetId],
        set: {
          hours: sql.raw(`excluded.${timeSheetEntrySchema.hours.name}`),
          pricePerHour: sql.raw(`excluded.${timeSheetEntrySchema.pricePerHour.name}`)
        }
      });
  },

  deleteTimeSheetEntry: async (input: DeleteTimeSheetEntryInput, user: UserModel) => {
    await getAndValidateTimeSheet(input.timeSheetId, user);

    const { count } = await db
      .delete(timeSheetEntrySchema)
      .where(
        and(
          eq(timeSheetEntrySchema.timeSheetId, input.timeSheetId),
          eq(timeSheetEntrySchema.date, input.date)
        )
      );

    if (count === 0) {
      throw TimeSheetEntryNotFound();
    }
  },

  deleteTimeSheetEntryBulk: async (input: DeleteTimeSheetEntryBulkInput, user: UserModel) => {
    await getAndValidateTimeSheet(input.timeSheetId, user);

    await db
      .delete(timeSheetEntrySchema)
      .where(
        and(
          eq(timeSheetEntrySchema.timeSheetId, input.timeSheetId),
          inArray(timeSheetEntrySchema.date, input.dates)
        )
      );
  }
};
