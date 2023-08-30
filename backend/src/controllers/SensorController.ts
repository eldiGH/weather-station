import { HttpStatus } from '../types';
import { controller, endpointFactory } from '../helpers';

import { SensorService } from '../services';
import {
  createSensorSchema,
  getLatestBME68XDataEntryMapper,
  getSensorDataParamsSchema,
  getSensorDataQuerySchema,
  postBME68XDataSchema
} from 'shared';

export const SensorController = controller('/sensors');
const endpoint = endpointFactory(SensorController);

endpoint(
  {
    name: 'Add new sensor',
    method: 'post',
    path: '/',
    bodyValidationSchema: createSensorSchema
  },
  async (req, res) => {
    const secret = await SensorService.addNewSensor(req.body);

    res.status(HttpStatus.CREATED).send({ secret });
  }
);

endpoint(
  {
    name: 'Post bme68X data',
    path: '/bme68X',
    method: 'post',
    bodyValidationSchema: postBME68XDataSchema
  },
  async (req, res) => {
    await SensorService.addBME68XDataEntry(req.body);

    res.status(HttpStatus.CREATED).send();
  }
);

endpoint(
  {
    name: 'Get latest bme68x data from sensor',
    path: '/bme68x/:sensorId/last',
    method: 'get',
    paramsValidationSchema: getSensorDataParamsSchema
  },
  async (req, res) => {
    const { sensorId } = req.params;

    const data = await SensorService.getLatestBME68XDataEntry(sensorId);

    res.send(getLatestBME68XDataEntryMapper(data));
  }
);

endpoint(
  {
    name: 'Get all bme68x data from sensor',
    path: '/bme68x/:sensorId',
    method: 'get',
    paramsValidationSchema: getSensorDataParamsSchema,
    queryValidationSchema: getSensorDataQuerySchema
  },
  async (req, res) => {
    const { sensorId } = req.params;

    const data = await SensorService.getBME68XData(sensorId, req.query);

    res.send(data.map(getLatestBME68XDataEntryMapper));
  }
);
