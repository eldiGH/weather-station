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
