import { HttpStatus } from '../types';
import { controller, endpointFactory } from '../helpers';

import { SensorService } from '../services';
import { SensorDataNotFound } from '../errors';
import { createSensorSchema, getLatestBME68XDataEntryMapper, postBME68XDataSchema } from 'shared';

export const SensorController = controller('/sensors');
const endpoint = endpointFactory(SensorController);

endpoint(
  {
    name: 'Add new sensor',
    method: 'post',
    path: '/',
    validationSchema: createSensorSchema
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
    validationSchema: postBME68XDataSchema
  },
  async (req, res) => {
    await SensorService.addBME68XDataEntry(req.body);

    res.status(HttpStatus.CREATED).send();
  }
);

endpoint(
  {
    name: 'Get latest bme68x data from sensor',
    path: '/bme68x/:id',
    method: 'get'
  },
  async (req, res) => {
    const sensorId = (req.params as { id: number | string }).id;

    if (typeof sensorId !== 'string') {
      throw SensorDataNotFound();
    }

    const parsedId = parseInt(sensorId);

    if (isNaN(parsedId)) {
      throw SensorDataNotFound();
    }

    const data = await SensorService.getLatestBME68XDataEntry(parsedId);

    res.send(getLatestBME68XDataEntryMapper(data));
  }
);
