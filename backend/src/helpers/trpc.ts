import { type DataTransformer } from '@trpc/server';
import { stringify, parse } from 'devalue';

const devalueTransformer: DataTransformer = {
  serialize: (object) => stringify(object),
  deserialize: (object) => {
    if (typeof object === 'string') {
      return parse(object);
    }

    return object;
  }
};

export const transformer = {
  input: devalueTransformer,
  output: devalueTransformer
};
