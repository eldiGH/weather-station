import { router, authedProcedure, publicProcedure } from '..';
import { getSensorDataInputSchema, getSensorDataOutputSchema } from '../../schemas';
import { postBME68XDataSchema } from '../../schemas/bme68x';
import { SensorServiceTRPC } from '../services';

export const sensorRouter = router({
  getSensorData: authedProcedure
    .input(getSensorDataInputSchema)
    .output(getSensorDataOutputSchema)
    .query(({ input }) => SensorServiceTRPC.getBME68XData(input.sensorId, input.dateRangeQuery)),

  postBME68xData: publicProcedure.input(postBME68XDataSchema).mutation(({ input }) => {
    SensorServiceTRPC.addBME68XDataEntry(input);
  })
});
