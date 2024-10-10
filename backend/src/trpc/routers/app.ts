import type { inferRouterOutputs } from '@trpc/server';
import { router } from '..';
import { authRouter } from './auth';
import { kioskRouter } from './kiosk';
import { sensorRouter } from './sensor';
import { timeSheetRouter } from './timeSheet';

export const appRouter = router({
  kiosk: kioskRouter,
  sensor: sensorRouter,
  auth: authRouter,
  timeSheet: timeSheetRouter
});

export type AppRouter = typeof appRouter;
export type AppRouterOutputs = inferRouterOutputs<AppRouter>;
export type { inferObservableValue } from '@trpc/server/observable';
export type { inferProcedureOutput } from '@trpc/server';
