import { format, getDaysInMonth, set } from 'date-fns';

export const dateComparatorDesc = (a: Date, b: Date) => b.getTime() - a.getTime();

export const dateStringComparatorDesc = (a: string, b: string) =>
  dateComparatorDesc(new Date(a), new Date(b));

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

export const formatToStringDate = (date: Date | string) => {
  return format(date, 'yyyy-MM-dd');
};

export const getMonthsBoundaries = (date: Date | string) => ({
  from: formatToStringDate(set(date, { date: 1 })),
  to: formatToStringDate(set(date, { date: getDaysInMonth(date) }))
});
