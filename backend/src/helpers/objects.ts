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

export const shallowEqual = (a: Record<string, unknown>, b: Record<string, unknown>) => {
  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }

  for (const key in a) {
    if (a[key] !== b[key]) {
      return false;
    }
  }

  return true;
};
