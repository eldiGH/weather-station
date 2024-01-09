import { router, authedProcedure } from '..';
import { getSensorDataInputSchema, getSensorDataOutputSchema } from '../../schemas';
import { SensorServiceTRPC } from '../services';

export const sensorRouter = router({
  getSensorData: authedProcedure
    .input(getSensorDataInputSchema)
    .output(getSensorDataOutputSchema)
    .query(({ input }) => SensorServiceTRPC.getBME68XData(input.sensorId, input.dateRangeQuery))
});
