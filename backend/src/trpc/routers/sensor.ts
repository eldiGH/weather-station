import { router, authedProcedure, publicProcedure } from '..';
import {
  createSensorInputSchema,
  createSensorTemplateSchema,
  postSensorDataSchema
} from '../../schemas/sensor';
import { SensorService } from '../../services/SensorService';
import * as uuid from 'uuid';

const SENSOR_SECRET_HEADER = 'Sensor-Secret';

const sensorSecretProcedure = publicProcedure
  .input(postSensorDataSchema)
  .use(({ input, ctx, next }) => {
    const sensorSecretUrl = ctx.urlParam;
    if (sensorSecretUrl && uuid.validate(sensorSecretUrl)) {
      return next({ ctx: { sensorSecret: sensorSecretUrl } });
    }

    const sensorSecretHeader = ctx.req.headers[SENSOR_SECRET_HEADER];

    if (typeof sensorSecretHeader === 'string' && uuid.validate(sensorSecretHeader)) {
      return next({ ctx: { sensorSecret: sensorSecretHeader } });
    }

    const sensorSecretBody = input['sensorSecret'];

    if (typeof sensorSecretBody !== 'string' || !uuid.validate(sensorSecretBody)) {
      throw new Error('No sensor secret provided.');
    }

    return next({ ctx: { sensorSecret: sensorSecretBody } });
  });

export const sensorRouter = router({
  createSensor: authedProcedure
    .input(createSensorInputSchema)
    .mutation(({ input, ctx }) => SensorService.addNewSensor(input, ctx.user)),

  createSensorTemplate: authedProcedure
    .input(createSensorTemplateSchema)
    .mutation(({ ctx, input }) => SensorService.createSensorTemplate(input, ctx.user)),

  postSensorData: sensorSecretProcedure.mutation(({ input, ctx }) =>
    SensorService.postSensorData(ctx.sensorSecret, input)
  ),

  getSensorTemplates: authedProcedure.query(({ ctx }) => SensorService.getSensorTemplates(ctx.user))

  // getSensorData: authedProcedure.input(getSensorDataInputSchema).query(async ({ input }) => {
  //   const { data, error } = await SensorService.getBME68XData(input.sensorId, input.dateRangeQuery);
  //   if (error) {
  //     return Err(error);
  //   }

  //   return Ok(await getSensorDataOutputSchema.parseAsync(data));
  // }),
});
