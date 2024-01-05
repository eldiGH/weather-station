import { router } from '..';
import { authRouter } from './auth';
import { kioskRouter } from './kiosk';
import { sensorRouter } from './sensor';

export const appRouter = router({
  kiosk: kioskRouter,
  sensor: sensorRouter,
  auth: authRouter
});

export type AppRouter = typeof appRouter;
