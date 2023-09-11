import { controller, endpointFactory } from '../helpers';

import {
  HttpStatus,
  createKioskBodySchema,
  getKioskDataParamsSchema,
  getKioskSensorQuerySchema,
  getLatestBME68XDataEntryMapper,
  getSensorDataQuerySchema,
  kioskDataResponseMapper,
  sensorResponseWithDataMapper
} from 'shared';
import { KioskService } from '../services/KioskService';

export const KioskController = controller('/kiosk');
const endpoint = endpointFactory(KioskController);

endpoint(
  {
    name: 'Create kiosk',
    method: 'post',
    path: '/',
    bodyValidationSchema: createKioskBodySchema,
    auth: true
  },
  async (req, res) => {
    const data = await KioskService.createKiosk(req.body, res.locals.user);

    res.status(HttpStatus.CREATED).send(data);
  }
);

endpoint(
  {
    name: 'Get kiosk data',
    method: 'get',
    path: '/:kioskUuid',
    paramsValidationSchema: getKioskDataParamsSchema
  },
  async (req, res) => {
    const kiosk = await KioskService.getKioskData(req.params.kioskUuid);

    res.send(kioskDataResponseMapper(kiosk));
  }
);

endpoint(
  {
    name: 'Get kiosk sensor',
    method: 'get',
    path: '/:kioskUuid/:sensorId',
    paramsValidationSchema: getKioskSensorQuerySchema,
    queryValidationSchema: getSensorDataQuerySchema
  },
  async (req, res) => {
    const { kioskUuid, sensorId } = req.params;

    const data = await KioskService.getKioskSensorData(kioskUuid, sensorId, req.query);

    res.status(HttpStatus.OK).send(sensorResponseWithDataMapper(data));
  }
);

endpoint(
  {
    name: 'Get kiosk sensor data',
    method: 'get',
    path: '/:kioskUuid/:sensorId/data',
    paramsValidationSchema: getKioskSensorQuerySchema,
    queryValidationSchema: getSensorDataQuerySchema
  },
  async (req, res) => {
    const { kioskUuid, sensorId } = req.params;

    const data = await KioskService.getKioskSensorData(kioskUuid, sensorId, req.query);

    res.status(HttpStatus.OK).send(data.bme68XData.map(getLatestBME68XDataEntryMapper));
  }
);
