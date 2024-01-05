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
  { from, to, fromLastDays }: DateRanges = {}
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

export const dateComparatorDesc = (a: Date, b: Date) => b.getTime() - a.getTime();

export const calculateAvgDiffSeconds = (dates: Date[]) => {
  if (dates.length < 2) {
    return -1;
  }

  const sortedDates = dates.sort(dateComparatorDesc);
  const differenceTimes: number[] = [];

  for (let i = 0; i < sortedDates.length - 1; i++) {
    differenceTimes.push(sortedDates[i].getTime() / 1000 - sortedDates[i + 1].getTime() / 1000);
  }

  return differenceTimes.reduce((a, b) => a + b) / sortedDates.length;
};
