import {
  and,
  asc,
  type ColumnBaseConfig,
  desc,
  gte,
  lte,
  type SQL,
  type ColumnDataType,
  sql
} from 'drizzle-orm';
import type { DateRangeQuery, TimestampRangeQuery } from '../schemas';
import { PgColumn, PgTable, type PgTableWithColumns } from 'drizzle-orm/pg-core';
import { subDays } from 'date-fns';
import type { QueryOrder } from '../types/QueryOptions';
import { db } from '../db/drizzle';

export const getSQLForDates = <T extends ColumnBaseConfig<ColumnDataType, string>>(
  column: PgColumn<T>,
  timestampOrDateRanges: TimestampRangeQuery | DateRangeQuery
): SQL<unknown> | undefined => {
  const { from, to, fromLastDays } = timestampOrDateRanges ?? {};

  if (from && to) {
    return and(gte(column, from), lte(column, to));
  } else if (from) {
    return gte(column, from);
  } else if (to) {
    return lte(column, to);
  } else if (fromLastDays) {
    const date = subDays(new Date(), fromLastDays);

    return gte(column, date);
  }

  return undefined;
};

const orderFunctions = {
  asc,
  desc
};

export const getSQLForOrder = (column: PgColumn, order: QueryOrder['order']) => {
  if (!order) {
    return order;
  }

  return [orderFunctions[order](column)];
};

export const coalesce = <T>(value: SQL.Aliased<T> | SQL<T>, defaultValue: SQL) =>
  sql<T>`coalesce(${value}, ${defaultValue})`;

export const bulkUpdate = <
  S extends PgTable,
  C extends S extends PgTableWithColumns<infer X>
    ? X['columns'] extends Record<string, infer T>
      ? { [key: string]: Extract<T, PgColumn> }
      : Record<string, PgColumn>
    : Record<string, PgColumn>,
  D extends { [key in keyof C]: C[key] extends PgColumn<infer T> ? T['data'] : undefined },
  I = C extends Record<string, infer X> ? X : never
>(
  table: S,
  config: C,
  identifierColumn: NoInfer<I>,
  data: NoInfer<D[]>
) => {
  const sqls = {} as Record<keyof C, SQL[]>;
  let identifierField: keyof C | null = null;

  for (const field in config) {
    if (config[field] === identifierColumn) {
      identifierField = field;
      continue;
    }
    sqls[field] = [sql`(case`];
  }

  if (!identifierField) {
    throw Error('Identifier column missing');
  }

  for (const item of data) {
    for (const field in config) {
      if (field === identifierField) {
        continue;
      }
      sqls[field].push(
        sql`when ${identifierColumn} = ${item[identifierField]} then ${item[field]}`
      );
    }
  }

  const finalSetObject = {} as Record<string, SQL>;

  for (const field in config) {
    if (field === identifierField) {
      continue;
    }
    const chunks = sqls[field];
    chunks.push(sql`end)`);

    finalSetObject[field] = sql.join(chunks, sql.raw(' '));
  }

  return db.update(table).set(finalSetObject);
};

export type DateTruncateField =
  | 'microseconds'
  | 'milliseconds'
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'
  | 'decade'
  | 'century'
  | 'millennium';

export const dateTruncate = (date: string | Date | SQL, field: DateTruncateField) => {
  const parsedDate = date instanceof Date ? new Date(date) : date;

  return sql`date_trunc(${field}, ${parsedDate}::timestamp)`;
};

type TimeIntervalUnit = 'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds';
type TimeInterval = `${number} ${TimeIntervalUnit}`;

export const timeInterval = (interval: TimeInterval) => sql`${interval}::interval`;

export const dbConstants = {
  currentDate: sql.raw('CURRENT_DATE')
};

export const dbOps = {
  subtract: (a: SQL, b: SQL) => sql`${a} - ${b}`,
  add: (a: SQL, b: SQL) => sql`${a} + ${b}`
};
