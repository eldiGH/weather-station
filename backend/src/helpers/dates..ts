import { subDays } from 'date-fns';

interface DateRanges {
  from?: Date;
  to?: Date;
  fromLastDays?: number;
}

export type GetWhereBetweenDatesResult<T extends string> =
  | {
      [key in T]: Date;
    }
  | {
      AND: { [key in T]: Date }[];
    }
  | object;

export const getWhereForDates = <T extends string>(
  fieldName: T,
  { from, to, fromLastDays }: DateRanges
): GetWhereBetweenDatesResult<T> => {
  if (from && to) {
    return { AND: [{ [fieldName]: { gte: from } }, { [fieldName]: { lte: to } }] };
  } else if (from) {
    return { [fieldName]: { gte: from } };
  } else if (to) {
    return { [fieldName]: { lte: from } };
  } else if (fromLastDays) {
    const date = subDays(new Date(), fromLastDays);

    return { [fieldName]: { gte: date } };
  }

  return {};
};
