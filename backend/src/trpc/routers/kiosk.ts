import { router, publicProcedure, authedProcedure } from '..';
import { Err, Ok } from '../../helpers/control';
import { addNewSensorDataListener } from '../../helpers/eventEmitter';
import {
  getKioskDataInputSchema,
  getForecastForKioskInputSchema,
  getKioskSensorDetailsInputSchema,
  subscribeKioskInputSchema,
  createKioskInputSchema
} from '../../schemas';
import type { SubscribeBME68xData } from '../../schemas/bme68x';
import { KioskService } from '../../services/KioskService';
import { observable } from '@trpc/server/observable';
import type { ApiResponseSuccess } from '../../types';

export const kioskRouter = router({
  createKiosk: authedProcedure
    .input(createKioskInputSchema)
    .mutation(({ input, ctx }) => KioskService.createKiosk(input, ctx.user)),

  getKioskData: publicProcedure.input(getKioskDataInputSchema).query(async ({ input }) => {
    const { data, error } = await KioskService.getKioskData(input.kioskUuid);
    if (error) {
      return Err(error);
    }

    return Ok(await getKioskDataOutputSchema.parseAsync(data));
  }),

  subscribeKiosk: publicProcedure
    .input(subscribeKioskInputSchema)
    .subscription(async ({ input: { kioskUuid } }) => {
      const { data: kiosk, error } = await KioskService.getKiosk(kioskUuid);
      if (error) {
        return Err(error);
      }

      return observable<ApiResponseSuccess<SubscribeBME68xData>>((emit) => {
        const disposers: (() => void)[] = [];

        for (const sensor of kiosk.sensors) {
          const sensorId = sensor.id;
          const dispose = addNewSensorDataListener(sensorId, (data) => {
            emit.next(Ok({ ...data, sensorId }));
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
    .query(({ input }) => KioskService.getKioskForecast(input.kioskUuid)),

  getKioskSensorDetails: publicProcedure
    .input(getKioskSensorDetailsInputSchema)
    .query(({ input: { kioskUuid, sensorId, dateRangeQuery } }) =>
      KioskService.getKioskSensorData(kioskUuid, sensorId, dateRangeQuery)
    )
});
