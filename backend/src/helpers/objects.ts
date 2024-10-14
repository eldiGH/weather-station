export const convertArrayToDict = <
  T extends Record<string | number | symbol, unknown>,
  K extends keyof T,
  R extends string | number | symbol = T[K] extends string | number | symbol ? T[K] : string
>(
  array: T[],
  keyPropName: K
): Record<R, T | undefined> => {
  const result = {} as Record<string | number | symbol, T>;

  for (const item of array) {
    const key = item[keyPropName];

    if (typeof key !== 'string' && typeof key !== 'symbol' && typeof key !== 'number') {
      continue;
    }

    result[key] = item;
  }

  return result as Record<R, T | undefined>;
};
