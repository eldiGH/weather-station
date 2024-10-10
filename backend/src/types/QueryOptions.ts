import type { TimestampRangeQuery } from '../schemas';

export type QueryDates = {
  dates?: TimestampRangeQuery;
};

export type QueryLimit = {
  limit?: number;
};

export type QueryOrder = {
  order?: 'asc' | 'desc';
};
