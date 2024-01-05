import { initTRPC } from '@trpc/server';
import { transformer } from '../helpers/trpc';

export const { router, procedure: publicProcedure } = initTRPC.create({
  transformer,
  errorFormatter: (err) => {
    return { ...err.shape, data: { ...err.error.cause } };
  }
});
