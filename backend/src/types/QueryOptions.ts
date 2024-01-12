import { DateRangeQuery } from '../schemas';

export type QueryDates = {
  dates?: DateRangeQuery;
};

export type QueryLimit = {
  limit?: number;
};

export type QueryOrder = {
  order?: 'asc' | 'desc';
};
