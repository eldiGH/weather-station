import { and, asc, type ColumnBaseConfig, desc, gte, lte, type SQL } from 'drizzle-orm';
import type { DateRangeQuery } from '../schemas';
import { PgColumn } from 'drizzle-orm/pg-core';
import { subDays } from 'date-fns';
import type { QueryOrder } from '../types/QueryOptions';

export const getSQLForDates = (
  column: PgColumn<ColumnBaseConfig<'date', 'PgTimestamp'>>,
  dateRanges: DateRangeQuery
): SQL<unknown> | undefined => {
  const { from, to, fromLastDays } = dateRanges ?? {};

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
