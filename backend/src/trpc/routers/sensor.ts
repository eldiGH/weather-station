import { router, authedProcedure } from '..';
import { Err, Ok } from '../../helpers/control';
import { createSensorInputSchema, createSensorTemplateSchema } from '../../schemas/sensor';
import { SensorService } from '../../services/SensorService';

export const sensorRouter = router({
  createSensor: authedProcedure
    .input(createSensorInputSchema)
    .mutation(({ input, ctx }) => SensorService.addNewSensor(input, ctx.user)),

  createSensorTemplate: authedProcedure
    .input(createSensorTemplateSchema)
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await SensorService.createSensorTemplate(input, ctx.user);
      if (error) {
        return Err(error);
      }

      return Ok(data);
    })

  // getSensorData: authedProcedure.input(getSensorDataInputSchema).query(async ({ input }) => {
  //   const { data, error } = await SensorService.getBME68XData(input.sensorId, input.dateRangeQuery);
  //   if (error) {
  //     return Err(error);
  //   }

  //   return Ok(await getSensorDataOutputSchema.parseAsync(data));
  // }),

  // postBME68xData: publicProcedure
  //   .input(postBME68XDataInputSchema)
  //   .mutation(({ input }) => SensorService.addBME68XDataEntry(input)),
});
