import { router, publicProcedure } from '..';
import { getSensorDataInputSchema, getSensorDataOutputSchema } from '../../schemas';
import { SensorServiceTRPC } from '../services';

export const sensorRouter = router({
  getSensorData: publicProcedure
    .input(getSensorDataInputSchema)
    .output(getSensorDataOutputSchema)
    .query(({ input }) => SensorServiceTRPC.getBME68XData(input.sensorId, input.dateRangeQuery))
});
