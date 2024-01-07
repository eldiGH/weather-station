import { router, publicProcedure, authedProcedure } from '..';
import { addNewSensorDataListener } from '../../helpers/eventEmitter';
import {
  getKioskDataInputSchema,
  getKioskDataOutputSchema,
  getForecastForKioskInputSchema,
  getKioskSensorDetailsInputSchema,
  subscribeKioskInputSchema,
  createKioskInputSchema
} from '../../schemas';
import { SubscribeBME68xData } from '../../schemas/bme68x';
import { KioskServiceTRPC } from '../services';
import { observable } from '@trpc/server/observable';

export const kioskRouter = router({
  createKiosk: authedProcedure
    .input(createKioskInputSchema)
    .mutation(({ input, ctx }) => KioskServiceTRPC.createKiosk(input, ctx.user)),

  getKioskData: publicProcedure
    .input(getKioskDataInputSchema)
    .output(getKioskDataOutputSchema)
    .query(({ input }) => KioskServiceTRPC.getKioskData(input.kioskUuid)),

  subscribeKiosk: publicProcedure
    .input(subscribeKioskInputSchema)
    .subscription(async ({ input: { kioskUuid } }) => {
      const kiosk = await KioskServiceTRPC.getKiosk(kioskUuid);

      return observable<SubscribeBME68xData>((emit) => {
        const disposers: (() => void)[] = [];

        for (const sensor of kiosk.sensors) {
          const sensorId = sensor.id;
          const dispose = addNewSensorDataListener(sensorId, (data) => {
            emit.next({ ...data, sensorId });
          });

          disposers.push(dispose);
        }

        return () => {
          for (const dispose of disposers) {
            dispose();
          }
        };
      });
    }),

  getForecastForKiosk: publicProcedure
    .input(getForecastForKioskInputSchema)
    .query(({ input }) => KioskServiceTRPC.getKioskForecast(input.kioskUuid)),

  getKioskSensorDetails: publicProcedure
    .input(getKioskSensorDetailsInputSchema)
    .query(({ input: { kioskUuid, sensorId, dateRangeQuery } }) =>
      KioskServiceTRPC.getKioskSensorData(kioskUuid, sensorId, dateRangeQuery)
    )
});
