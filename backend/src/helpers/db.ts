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
import { PgColumn } from 'drizzle-orm/pg-core';
import { subDays } from 'date-fns';
import type { QueryOrder } from '../types/QueryOptions';

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

export const coalesce = <T>(value: SQL.Aliased<T> | SQL<T>, defaultValue: SQL) => {
  return sql<T>`coalesce(${value}, ${defaultValue})`;
};
