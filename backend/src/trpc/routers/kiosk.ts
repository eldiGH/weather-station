import { router, publicProcedure } from '..';
import {
  getKioskDataInputSchema,
  getKioskDataOutputSchema,
  getForecastForKioskInputSchema,
  getKioskSensorDetailsInputSchema
} from '../../schemas';
import { KioskServiceTRPC } from '../services';

export const kioskRouter = router({
  // createKiosk: publicProcedure
  //   .input(createKioskInputSchema)
  //   .mutation(({ input, ctx }) => KioskService.createKiosk(input)),

  getKioskData: publicProcedure
    .input(getKioskDataInputSchema)
    .output(getKioskDataOutputSchema)
    .query(({ input }) => KioskServiceTRPC.getKioskData(input.kioskUuid)),

  getForecastForKiosk: publicProcedure
    .input(getForecastForKioskInputSchema)
    .query(({ input }) => KioskServiceTRPC.getKioskForecast(input.kioskUuid)),

  getKioskSensorDetails: publicProcedure
    .input(getKioskSensorDetailsInputSchema)
    .query(({ input: { kioskUuid, sensorId, dateRangeQuery } }) =>
      KioskServiceTRPC.getKioskSensorData(kioskUuid, sensorId, dateRangeQuery)
    )
});
