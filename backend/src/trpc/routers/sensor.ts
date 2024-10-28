import { router, authedProcedure, publicProcedure } from '..';
import { Err, Ok } from '../../helpers/control';
import {
  createSensorInputSchema,
  getSensorDataInputSchema,
  getSensorDataOutputSchema
} from '../../schemas';
import { postBME68XDataInputSchema } from '../../schemas/bme68x';
import { SensorService } from '../../services/SensorService';

export const sensorRouter = router({
  getSensorData: authedProcedure.input(getSensorDataInputSchema).query(async ({ input }) => {
    const { data, error } = await SensorService.getBME68XData(input.sensorId, input.dateRangeQuery);
    if (error) {
      return Err(error);
    }

    return Ok(await getSensorDataOutputSchema.parseAsync(data));
  }),

  postBME68xData: publicProcedure
    .input(postBME68XDataInputSchema)
    .mutation(({ input }) => SensorService.addBME68XDataEntry(input)),

  createSensor: authedProcedure
    .input(createSensorInputSchema)
    .mutation(({ input, ctx }) => SensorService.addNewSensor(input, ctx.user))
});
