import { and, count, desc, eq, gte, inArray, lt, sql, sum } from 'drizzle-orm';
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
      await db
        .select()
        .from(timeSheetSchema)
        .where(and(eq(timeSheetSchema.ownerId, user.id), eq(timeSheetSchema.name, data.name)))
    ).at(0);

    if (existingTimeSheetWithSameNameForUser) {
      throw TimeSheetNameAlreadyUsed(data.name);
    }

    const { id } = (
      await db
        .insert(timeSheetSchema)
        .values({ ...data, ownerId: user.id })
        .returning()
    )[0];

    return { id };
  },

  getTimeSheet: async (data: GetTimeSheetInput, user: UserModel) => {
    const timeSheet = await db.query.timeSheetSchema.findFirst({
      where: (timeSheet, { eq }) => eq(timeSheet.id, data.id),
      with: {
        entries: {
          where: getSQLForDates(timeSheetEntrySchema.date, data.dates),
          orderBy: desc(timeSheetEntrySchema.date)
        }
      }
    });

    const { id, name, defaultPricePerHour, defaultHours, createdAt, entries } = validateTimeSheet(
      timeSheet,
      user
    );

    const stats = entries.reduce(
      (acc, { pricePerHour, hours }) => ({
        ...acc,
        hours: acc.totalHours + hours,
        price: acc.totalPrice + pricePerHour
      }),
      { totalHours: 0, totalPrice: 0 }
    );

    return {
      id,
      name,
      defaultPricePerHour,
      defaultHours,
      createdAt,
      entries: entries.map(({ date, hours, pricePerHour, createdAt }) => ({
        date,
        hours,
        pricePerHour,
        createdAt
      })),
      stats
    };
  },

  getTimeSheetsForUser: async (user: UserModel) => {
    const lastMonthDate = sql<string>`(DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month')::date`;
    const currentMonthDate = sql<string>`DATE_TRUNC('month', CURRENT_DATE)::date`;

    const timeSheetEntriesQuery = db.$with('entries').as(
      db
        .select({
          timeSheet: { ...timeSheetSchema },
          timeSheetEntry: {
            ...timeSheetEntrySchema,
            createdAt: sql`${timeSheetEntrySchema.createdAt}`.as('entryCreatedAt')
          }
        })
        .from(timeSheetSchema)
        .innerJoin(timeSheetEntrySchema, eq(timeSheetSchema.id, timeSheetEntrySchema.timeSheetId))
        .where(and(eq(timeSheetSchema.ownerId, 1), gte(timeSheetEntrySchema.date, lastMonthDate)))
    );

    const currentMonthEntriesQuery = db
      .select({
        count: count().as('currentMonthCount'),
        hours: sum(timeSheetEntriesQuery.timeSheetEntry.hours).as('currentMonthHours'),
        totalPrice: sum(
          sql<number>`${timeSheetEntriesQuery.timeSheetEntry.hours} * ${timeSheetEntriesQuery.timeSheetEntry.pricePerHour}`
        ).as('currentMonthTotalPrice'),
        timeSheetId: timeSheetEntriesQuery.timeSheet.id
      })
      .from(timeSheetEntriesQuery)
      .where(gte(timeSheetEntriesQuery.timeSheetEntry.date, currentMonthDate))
      .groupBy(timeSheetEntriesQuery.timeSheet.id)
      .as('currentMonthEntries');

    const lastMonthEntriesQuery = db
      .select({
        count: count().as('lastMonthCount'),
        hours: sum(timeSheetEntriesQuery.timeSheetEntry.hours).as('lastMonthHours'),
        totalPrice: sum(
          sql<number>`${timeSheetEntriesQuery.timeSheetEntry.hours} * ${timeSheetEntriesQuery.timeSheetEntry.pricePerHour}`
        ).as('lastMonthTotalPrice'),
        timeSheetId: timeSheetEntriesQuery.timeSheet.id
      })
      .from(timeSheetEntriesQuery)
      .where(lt(timeSheetEntriesQuery.timeSheetEntry.date, currentMonthDate))
      .groupBy(timeSheetEntriesQuery.timeSheet.id)
      .as('lastMonthEntries');

    const data = await db
      .with(timeSheetEntriesQuery)
      .select()
      .from(timeSheetSchema)
      .leftJoin(
        currentMonthEntriesQuery,
        eq(currentMonthEntriesQuery.timeSheetId, timeSheetSchema.id)
      )
      .leftJoin(lastMonthEntriesQuery, eq(lastMonthEntriesQuery.timeSheetId, timeSheetSchema.id))
      .where(eq(timeSheetSchema.ownerId, user.id));

    return data.map((d) => ({
      id: d.time_sheet.id,
      name: d.time_sheet.name,
      createdAt: d.time_sheet.createdAt,
      defaultHours: d.time_sheet.defaultHours,
      defaultPricePerHour: d.time_sheet.defaultPricePerHour,
      currentMonth: {
        count: d.currentMonthEntries?.count ?? 0,
        totalPrice: parseFloat(d.currentMonthEntries?.totalPrice ?? '0'),
        hours: parseFloat(d.currentMonthEntries?.hours ?? '0')
      },
      lastMonth: {
        count: d.lastMonthEntries?.count ?? 0,
        totalPrice: parseFloat(d.lastMonthEntries?.totalPrice ?? '0'),
        hours: parseFloat(d.lastMonthEntries?.hours ?? '0')
      }
    }));
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

    const { rowCount } = await db
      .delete(timeSheetEntrySchema)
      .where(
        and(
          eq(timeSheetEntrySchema.timeSheetId, input.timeSheetId),
          eq(timeSheetEntrySchema.date, input.date)
        )
      );

    if (rowCount === 0) {
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
