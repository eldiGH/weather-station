import { and, count, desc, eq, gte, inArray, lt, lte, ne, sql, sum } from 'drizzle-orm';
import { db } from '../db/drizzle';
import { timeSheetEntry, timeSheet, type UserModel } from '../db/drizzle/schema';
import type {
  AddTimeSheetInput,
  DeleteTimeSheetEntryBulkInput,
  DeleteTimeSheetEntryInput,
  DeleteTimeSheetInput,
  EditTimeSheetInput,
  GetTimeSheetEntriesWithCursorInput,
  GetTimeSheetForMonthInput,
  SetTimeSheetEntryBulkInput,
  SetTimeSheetEntryForMonthInput,
  SetTimeSheetEntryInput
} from '../schemas/timeSheet';
import { TimeSheetNameAlreadyUsed } from '../errors/TimeSheetNameAlreadyUsed';
import { dateTruncate, dbConstants, dbOps, timeInterval } from '../helpers/db';
import { TimeSheetNotFound } from '../errors/TimeSheetNotFound';
import { AccessDenied } from '../errors/AccessDenied';
import { TimeSheetEntryNotFound } from '../errors/TimeSheetEntryNotFound';
import {
  dateStringComparatorDesc,
  formatToStringDate,
  getFirstDateOfMonth,
  getLastDateOfMonth
} from '../helpers/dates';
import { format, getDaysInMonth, subDays } from 'date-fns';
import { convertArrayToDict } from '../helpers';
import { TimeSheetEntryAlreadyExists } from '../errors/TimeSheetEntryAlreadyExists';

const timeSheetEntryOnConflictUpdateConfig = {
  target: [timeSheetEntry.date, timeSheetEntry.timeSheetId],
  set: {
    hours: sql.raw(`excluded.${timeSheetEntry.hours.name}`),
    pricePerHour: sql.raw(`excluded.${timeSheetEntry.pricePerHour.name}`)
  }
};

const validateTimeSheet = <T extends typeof timeSheet.$inferSelect>(
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
    (await db.select().from(timeSheet).where(eq(timeSheet.id, timeSheetId))).at(0),
    user
  );

export const TimeSheetService = {
  createTimeSheet: async (data: AddTimeSheetInput, user: UserModel) => {
    const existingTimeSheetWithSameNameForUser = (
      await db
        .select()
        .from(timeSheet)
        .where(and(eq(timeSheet.ownerId, user.id), eq(timeSheet.name, data.name)))
    ).at(0);

    if (existingTimeSheetWithSameNameForUser) {
      throw TimeSheetNameAlreadyUsed(data.name);
    }

    const { id, name, defaultHours, defaultPricePerHour, createdAt } = (
      await db
        .insert(timeSheet)
        .values({ ...data, ownerId: user.id })
        .returning()
    )[0];

    return { id, name, defaultHours, defaultPricePerHour, createdAt };
  },

  editTimeSheet: async (data: EditTimeSheetInput, user: UserModel) => {
    await getAndValidateTimeSheet(data.timeSheetId, user);

    const existingTimeSheetWithSameNameForUser = (
      await db
        .select()
        .from(timeSheet)
        .where(
          and(
            eq(timeSheet.ownerId, user.id),
            eq(timeSheet.name, data.name),
            ne(timeSheet.id, data.timeSheetId)
          )
        )
    ).at(0);

    if (existingTimeSheetWithSameNameForUser) {
      throw TimeSheetNameAlreadyUsed(data.name);
    }

    await db
      .update(timeSheet)
      .set({
        name: data.name,
        defaultPricePerHour: data.defaultPricePerHour,
        defaultHours: data.defaultHours
      })
      .where(eq(timeSheet.id, data.timeSheetId));
  },

  getTimeSheetForMonth: async (data: GetTimeSheetForMonthInput, user: UserModel) => {
    const timeSheet = await db.query.timeSheet.findFirst({
      where: (timeSheet, { eq, and }) =>
        and(eq(timeSheet.id, data.timeSheetId), eq(timeSheet.ownerId, user.id)),
      with: {
        entries: {
          columns: {
            date: true,
            hours: true,
            pricePerHour: true
          },
          where: and(
            gte(timeSheetEntry.date, getFirstDateOfMonth(data.date)),
            lte(timeSheetEntry.date, getLastDateOfMonth(data.date))
          ),
          orderBy: desc(timeSheetEntry.date)
        }
      }
    });

    const { entries } = validateTimeSheet(timeSheet, user);

    return entries;
  },

  getTimeSheetsForUser: async (user: UserModel) => {
    const truncatedTodayDate = dateTruncate(dbConstants.currentDate, 'month');

    const timeSheetEntriesQuery = db.$with('entries').as(
      db
        .select({
          timeSheet: { ...timeSheet },
          timeSheetEntry: {
            ...timeSheetEntry,
            createdAt: sql`${timeSheetEntry.createdAt}`.as('entryCreatedAt')
          }
        })
        .from(timeSheet)
        .innerJoin(timeSheetEntry, eq(timeSheet.id, timeSheetEntry.timeSheetId))
        .where(
          and(
            eq(timeSheet.ownerId, user.id),
            gte(timeSheetEntry.date, dbOps.subtract(truncatedTodayDate, timeInterval('1 months')))
          )
        )
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
      .where(
        and(
          gte(timeSheetEntriesQuery.timeSheetEntry.date, truncatedTodayDate),
          lt(
            timeSheetEntriesQuery.timeSheetEntry.date,
            dbOps.add(truncatedTodayDate, timeInterval('1 months'))
          )
        )
      )
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
      .where(lt(timeSheetEntriesQuery.timeSheetEntry.date, truncatedTodayDate))
      .groupBy(timeSheetEntriesQuery.timeSheet.id)
      .as('lastMonthEntries');

    const data = await db
      .with(timeSheetEntriesQuery)
      .select()
      .from(timeSheet)
      .leftJoin(currentMonthEntriesQuery, eq(currentMonthEntriesQuery.timeSheetId, timeSheet.id))
      .leftJoin(lastMonthEntriesQuery, eq(lastMonthEntriesQuery.timeSheetId, timeSheet.id))
      .where(eq(timeSheet.ownerId, user.id));

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

  deleteTimeSheet: async (input: DeleteTimeSheetInput, user: UserModel) => {
    await getAndValidateTimeSheet(input.timeSheetId, user);

    await db.transaction(async (tx) => {
      await tx.delete(timeSheetEntry).where(eq(timeSheetEntry.timeSheetId, input.timeSheetId));
      await tx.delete(timeSheet).where(eq(timeSheet.id, input.timeSheetId));
    });
  },

  setTimeSheetEntry: async (input: SetTimeSheetEntryInput, user: UserModel) => {
    await getAndValidateTimeSheet(input.timeSheetId, user);

    await db
      .insert(timeSheetEntry)
      .values(input)
      .onConflictDoUpdate(timeSheetEntryOnConflictUpdateConfig);
  },

  setTimeSheetEntryBulk: async (input: SetTimeSheetEntryBulkInput, user: UserModel) => {
    await getAndValidateTimeSheet(input.timeSheetId, user);

    await db
      .insert(timeSheetEntry)
      .values(input.entries.map((entry) => ({ ...entry, timeSheetId: input.timeSheetId })))
      .onConflictDoUpdate(timeSheetEntryOnConflictUpdateConfig);
  },

  setTimeSheetEntryForMonth: async (input: SetTimeSheetEntryForMonthInput, user: UserModel) => {
    await getAndValidateTimeSheet(input.timeSheetId, user);

    const formattedDate = formatToStringDate(input.date);

    const yearAndMonth = format(formattedDate, 'yyyy-MM');

    const filteredEntries = input.entries.filter(
      (entry) => format(entry.date, 'yyyy-MM') === yearAndMonth
    );
    const mappedEntries = filteredEntries.map((entry) => ({
      ...entry,
      date: formatToStringDate(entry.date),
      timeSheetId: input.timeSheetId
    }));
    const sortedEntries = mappedEntries.toSorted((a, b) =>
      dateStringComparatorDesc(a.date, b.date)
    );

    if (sortedEntries.length === 0) {
      await db
        .delete(timeSheetEntry)
        .where(
          and(
            sql`DATE_TRUNC('month', ${timeSheetEntry.date}::date) = DATE_TRUNC('month', ${formattedDate}::date)`,
            eq(timeSheetEntry.timeSheetId, input.timeSheetId)
          )
        );
      return;
    }

    const entriesDict = convertArrayToDict(sortedEntries, 'date');
    const entriesToDelete: string[] = [];

    const daysInMonth = getDaysInMonth(formattedDate);
    for (let i = daysInMonth; i >= 1; i--) {
      const date = format(
        formattedDate,
        `yyyy-MM-${i.toLocaleString('en-US', { minimumIntegerDigits: 2 })}`
      );

      if (!entriesDict[date]) {
        entriesToDelete.push(date);
      }
    }

    await db.transaction(async (tx) => {
      await tx
        .delete(timeSheetEntry)
        .where(
          and(
            inArray(timeSheetEntry.date, entriesToDelete),
            eq(timeSheetEntry.timeSheetId, input.timeSheetId)
          )
        );
      await tx
        .insert(timeSheetEntry)
        .values(sortedEntries)
        .onConflictDoUpdate(timeSheetEntryOnConflictUpdateConfig);
    });
  },

  deleteTimeSheetEntry: async (input: DeleteTimeSheetEntryInput, user: UserModel) => {
    await getAndValidateTimeSheet(input.timeSheetId, user);

    const { rowCount } = await db
      .delete(timeSheetEntry)
      .where(
        and(eq(timeSheetEntry.timeSheetId, input.timeSheetId), eq(timeSheetEntry.date, input.date))
      );

    if (rowCount === 0) {
      throw TimeSheetEntryNotFound();
    }
  },

  deleteTimeSheetEntryBulk: async (input: DeleteTimeSheetEntryBulkInput, user: UserModel) => {
    await getAndValidateTimeSheet(input.timeSheetId, user);

    await db
      .delete(timeSheetEntry)
      .where(
        and(
          eq(timeSheetEntry.timeSheetId, input.timeSheetId),
          inArray(timeSheetEntry.date, input.dates)
        )
      );
  },

  getTimeSheetEntriesWithCursor: async (
    input: GetTimeSheetEntriesWithCursorInput,
    user: UserModel
  ) => {
    await getAndValidateTimeSheet(input.timeSheetId, user);

    const cursor = input.cursor ? formatToStringDate(input.cursor) : undefined;

    const limit = (input.count ?? 10) + 1;

    const entries = await db
      .select({
        date: timeSheetEntry.date,
        hours: timeSheetEntry.hours,
        pricePerHour: timeSheetEntry.pricePerHour
      })
      .from(timeSheetEntry)
      .where(
        and(
          eq(timeSheetEntry.timeSheetId, input.timeSheetId),
          cursor ? lte(timeSheetEntry.date, cursor) : undefined
        )
      )
      .orderBy(desc(timeSheetEntry.date))
      .limit(limit);

    const lastEntry = entries[limit - 2]?.date;
    const nextCursor = lastEntry ? formatToStringDate(subDays(lastEntry, 1)) : undefined;

    return {
      entries: entries
        .values()
        .take(limit - 1)
        .toArray(),
      nextCursor
    };
  },

  addTimeSheetEntry: async (input: SetTimeSheetEntryInput, user: UserModel) => {
    await getAndValidateTimeSheet(input.timeSheetId, user);

    const { rowCount } = await db.insert(timeSheetEntry).values(input).onConflictDoNothing();

    if (rowCount === 0) {
      throw TimeSheetEntryAlreadyExists();
    }
  },

  editTimeSheetEntry: async (input: SetTimeSheetEntryInput, user: UserModel) => {
    const { timeSheetId, date, ...valuesToUpdate } = input;

    await getAndValidateTimeSheet(timeSheetId, user);

    const { rowCount } = await db
      .update(timeSheetEntry)
      .set(valuesToUpdate)
      .where(and(eq(timeSheetEntry.timeSheetId, timeSheetId), eq(timeSheetEntry.date, date)));

    if (rowCount === 0) {
      throw TimeSheetEntryNotFound();
    }
  }
};
