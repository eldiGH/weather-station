import { drizzle } from 'drizzle-orm/connect';
import 'dotenv/config';
import * as schema from '../src/db/drizzle/schema';
import bcryptjs from 'bcryptjs';
import { addMilliseconds, differenceInMilliseconds } from 'date-fns';

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('DATABASE_URL env variable missing!');
}

const { userSchema, sensorSchema, kioskSchema, kioskToSensorSchema, bme68xDataSchema } = schema;

const userData: (typeof userSchema.$inferInsert)[] = [
  { email: 'admin@gmail.com', password: '6Gfdn7x2VKBwOn9' }
];
const hashedUserData = await Promise.all(
  userData.map(async ({ password, ...rest }) => ({
    ...rest,
    password: await bcryptjs.hash(password, 10)
  }))
);

const sensorData: (typeof sensorSchema.$inferInsert)[] = [
  {
    name: 'Sypialka',
    secret: '6eda0536-c423-4c9b-bd62-ba43ad65223e',
    type: 'BME68X',
    ownerId: 1
  }
];

const kioskData: (typeof kioskSchema.$inferInsert)[] = [
  {
    kioskUuid: 'f12b96a3-42ee-4397-a1d8-f0d3eb7c6e47',
    ownerId: 1,
    latitude: 50.81062763793182,
    longitude: 19.10899356897146
  }
];

const kioskToSensorData: (typeof kioskToSensorSchema.$inferInsert)[] = [
  {
    kioskId: 1,
    sensorId: 1
  }
];

const bme68xData = [
  {
    temperature: 21.281,
    humidity: 33.6446,
    pressure: 100791.8125,
    gasResistance: 197174.8594,
    sensorId: 1,
    createdAt: new Date('2024-01-09T21:06:05.736Z'),
    batteryPercentage: 1597
  },
  {
    temperature: 21.3039,
    humidity: 33.4857,
    pressure: 100795.6484,
    gasResistance: 190252.6719,
    sensorId: 1,
    createdAt: new Date('2024-01-09T21:14:17.85Z'),
    batteryPercentage: 1599
  },
  {
    temperature: 21.3295,
    humidity: 34.1718,
    pressure: 100788.9531,
    gasResistance: 181364.6094,
    sensorId: 1,
    createdAt: new Date('2024-01-09T21:22:56.026Z'),
    batteryPercentage: 1600
  },
  {
    temperature: 21.3244,
    humidity: 33.7818,
    pressure: 100779.8984,
    gasResistance: 175679.2188,
    sensorId: 1,
    createdAt: new Date('2024-01-09T21:30:32.002Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 21.3244,
    humidity: 33.7485,
    pressure: 100788.1016,
    gasResistance: 164024.3906,
    sensorId: 1,
    createdAt: new Date('2024-01-09T21:30:50.265Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 21.3167,
    humidity: 34.8296,
    pressure: 100778.625,
    gasResistance: 164345.0625,
    sensorId: 1,
    createdAt: new Date('2024-01-09T21:38:53.512Z'),
    batteryPercentage: 1603
  },
  {
    temperature: 21.2912,
    humidity: 34.4639,
    pressure: 100768.8984,
    gasResistance: 162439.625,
    sensorId: 1,
    createdAt: new Date('2024-01-09T21:47:24.791Z'),
    batteryPercentage: 1603
  },
  {
    temperature: 21.3116,
    humidity: 34.5607,
    pressure: 100758.625,
    gasResistance: 160119.0469,
    sensorId: 1,
    createdAt: new Date('2024-01-09T21:55:36.407Z'),
    batteryPercentage: 1603
  },
  {
    temperature: 21.3295,
    humidity: 34.4618,
    pressure: 100767.0703,
    gasResistance: 156540.9688,
    sensorId: 1,
    createdAt: new Date('2024-01-09T22:04:16.283Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 21.3167,
    humidity: 34.3658,
    pressure: 100759.4766,
    gasResistance: 154243.1094,
    sensorId: 1,
    createdAt: new Date('2024-01-09T22:12:19.381Z'),
    batteryPercentage: 1603
  },
  {
    temperature: 21.2861,
    humidity: 34.6757,
    pressure: 100743.4219,
    gasResistance: 152011.75,
    sensorId: 1,
    createdAt: new Date('2024-01-09T22:20:40.952Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 21.2555,
    humidity: 34.6338,
    pressure: 100738.3359,
    gasResistance: 150111.6094,
    sensorId: 1,
    createdAt: new Date('2024-01-09T22:29:01.875Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 21.2504,
    humidity: 34.3652,
    pressure: 100740.2188,
    gasResistance: 148520.3125,
    sensorId: 1,
    createdAt: new Date('2024-01-09T22:37:24.439Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 21.2453,
    humidity: 34.2923,
    pressure: 100728.4453,
    gasResistance: 148389.2188,
    sensorId: 1,
    createdAt: new Date('2024-01-09T22:46:40.242Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 21.2606,
    humidity: 34.1432,
    pressure: 100720.0391,
    gasResistance: 146195.6406,
    sensorId: 1,
    createdAt: new Date('2024-01-09T22:54:25.77Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 21.2299,
    humidity: 34.1738,
    pressure: 100695.8125,
    gasResistance: 145688.9219,
    sensorId: 1,
    createdAt: new Date('2024-01-09T23:02:47.326Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 21.2478,
    humidity: 33.8638,
    pressure: 100698.7734,
    gasResistance: 144437.2969,
    sensorId: 1,
    createdAt: new Date('2024-01-09T23:10:50.093Z'),
    batteryPercentage: 1543
  },
  {
    temperature: 21.2631,
    humidity: 33.854,
    pressure: 100687.6562,
    gasResistance: 144810.5,
    sensorId: 1,
    createdAt: new Date('2024-01-09T23:19:36.861Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 21.2555,
    humidity: 33.6811,
    pressure: 100689.1094,
    gasResistance: 144810.5,
    sensorId: 1,
    createdAt: new Date('2024-01-09T23:27:50.57Z'),
    batteryPercentage: 1601
  },
  {
    temperature: 21.2504,
    humidity: 33.5863,
    pressure: 100691,
    gasResistance: 144935.3438,
    sensorId: 1,
    createdAt: new Date('2024-01-09T23:35:55.246Z'),
    batteryPercentage: 1603
  },
  {
    temperature: 21.2504,
    humidity: 33.5863,
    pressure: 100685.5312,
    gasResistance: 144065.9844,
    sensorId: 1,
    createdAt: new Date('2024-01-09T23:44:16.059Z'),
    batteryPercentage: 1604
  },
  {
    temperature: 21.2606,
    humidity: 33.4208,
    pressure: 100673.5547,
    gasResistance: 143573.875,
    sensorId: 1,
    createdAt: new Date('2024-01-09T23:52:38.027Z'),
    batteryPercentage: 1604
  },
  {
    temperature: 21.281,
    humidity: 33.6557,
    pressure: 100687.8906,
    gasResistance: 143696.5781,
    sensorId: 1,
    createdAt: new Date('2024-01-10T00:01:16.219Z'),
    batteryPercentage: 1603
  },
  {
    temperature: 21.3141,
    humidity: 33.842,
    pressure: 100674.2734,
    gasResistance: 143329.0781,
    sensorId: 1,
    createdAt: new Date('2024-01-10T00:09:21.005Z'),
    batteryPercentage: 1604
  },
  {
    temperature: 21.3448,
    humidity: 34.3628,
    pressure: 100684.8438,
    gasResistance: 142358.1719,
    sensorId: 1,
    createdAt: new Date('2024-01-10T00:17:49.095Z'),
    batteryPercentage: 1603
  },
  {
    temperature: 21.3575,
    humidity: 34.3193,
    pressure: 100684.2344,
    gasResistance: 141519.3594,
    sensorId: 1,
    createdAt: new Date('2024-01-10T00:26:13.497Z'),
    batteryPercentage: 1603
  },
  {
    temperature: 21.3728,
    humidity: 34.1925,
    pressure: 100692.25,
    gasResistance: 134823.5781,
    sensorId: 1,
    createdAt: new Date('2024-01-10T00:26:41.266Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 21.3881,
    humidity: 34.2329,
    pressure: 100683.8516,
    gasResistance: 136575.9531,
    sensorId: 1,
    createdAt: new Date('2024-01-10T00:34:42.642Z'),
    batteryPercentage: 1603
  },
  {
    temperature: 21.3907,
    humidity: 34.5401,
    pressure: 100684.2734,
    gasResistance: 134931.7812,
    sensorId: 1,
    createdAt: new Date('2024-01-10T00:42:46.867Z'),
    batteryPercentage: 1603
  },
  {
    temperature: 21.3856,
    humidity: 34.2773,
    pressure: 100688.8984,
    gasResistance: 134823.5781,
    sensorId: 1,
    createdAt: new Date('2024-01-10T00:51:44.354Z'),
    batteryPercentage: 1603
  },
  {
    temperature: 21.406,
    humidity: 34.3461,
    pressure: 100708.7109,
    gasResistance: 134177.9688,
    sensorId: 1,
    createdAt: new Date('2024-01-10T00:59:29.493Z'),
    batteryPercentage: 1603
  },
  {
    temperature: 21.3856,
    humidity: 33.8263,
    pressure: 100694.375,
    gasResistance: 133964.1406,
    sensorId: 1,
    createdAt: new Date('2024-01-10T01:07:49.883Z'),
    batteryPercentage: 1603
  },
  {
    temperature: 21.3881,
    humidity: 33.8654,
    pressure: 100700.2656,
    gasResistance: 128634.2734,
    sensorId: 1,
    createdAt: new Date('2024-01-10T01:08:26.347Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 21.3805,
    humidity: 33.6258,
    pressure: 100698.9766,
    gasResistance: 131040.5391,
    sensorId: 1,
    createdAt: new Date('2024-01-10T01:16:11.786Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 21.3626,
    humidity: 33.5631,
    pressure: 100690.5391,
    gasResistance: 132173.75,
    sensorId: 1,
    createdAt: new Date('2024-01-10T01:24:33.203Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 21.355,
    humidity: 33.5569,
    pressure: 100675.6016,
    gasResistance: 133326.7188,
    sensorId: 1,
    createdAt: new Date('2024-01-10T01:33:04.975Z'),
    batteryPercentage: 1600
  },
  {
    temperature: 21.3677,
    humidity: 33.6246,
    pressure: 100680.4453,
    gasResistance: 134285.1406,
    sensorId: 1,
    createdAt: new Date('2024-01-10T01:41:26.446Z'),
    batteryPercentage: 1601
  },
  {
    temperature: 21.3626,
    humidity: 33.5576,
    pressure: 100668.6562,
    gasResistance: 135148.7031,
    sensorId: 1,
    createdAt: new Date('2024-01-10T01:50:04.453Z'),
    batteryPercentage: 1601
  },
  {
    temperature: 21.3958,
    humidity: 33.8995,
    pressure: 100663.25,
    gasResistance: 135913.5,
    sensorId: 1,
    createdAt: new Date('2024-01-10T01:58:35.228Z'),
    batteryPercentage: 1601
  },
  {
    temperature: 21.4035,
    humidity: 33.878,
    pressure: 100664.5156,
    gasResistance: 136354.4219,
    sensorId: 1,
    createdAt: new Date('2024-01-10T02:06:30.407Z'),
    batteryPercentage: 1601
  },
  {
    temperature: 21.4086,
    humidity: 34.0676,
    pressure: 100654.4375,
    gasResistance: 136798.2031,
    sensorId: 1,
    createdAt: new Date('2024-01-10T02:14:58.918Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 21.4188,
    humidity: 33.7848,
    pressure: 100645.1719,
    gasResistance: 137920.4375,
    sensorId: 1,
    createdAt: new Date('2024-01-10T02:23:58.079Z'),
    batteryPercentage: 1601
  },
  {
    temperature: 21.4443,
    humidity: 33.5317,
    pressure: 100635.75,
    gasResistance: 138831.5469,
    sensorId: 1,
    createdAt: new Date('2024-01-10T02:31:51.925Z'),
    batteryPercentage: 1601
  },
  {
    temperature: 21.4417,
    humidity: 33.5869,
    pressure: 100629.8516,
    gasResistance: 139176.3281,
    sensorId: 1,
    createdAt: new Date('2024-01-10T02:39:56.386Z'),
    batteryPercentage: 1601
  },
  {
    temperature: 21.4417,
    humidity: 33.6202,
    pressure: 100632.5938,
    gasResistance: 140338.0625,
    sensorId: 1,
    createdAt: new Date('2024-01-10T02:48:17.534Z'),
    batteryPercentage: 1601
  },
  {
    temperature: 21.457,
    humidity: 33.5051,
    pressure: 100624.1953,
    gasResistance: 140455.3125,
    sensorId: 1,
    createdAt: new Date('2024-01-10T02:57:15.911Z'),
    batteryPercentage: 1601
  },
  {
    temperature: 21.4621,
    humidity: 33.2561,
    pressure: 100630.5234,
    gasResistance: 139176.3281,
    sensorId: 1,
    createdAt: new Date('2024-01-10T03:04:50.621Z'),
    batteryPercentage: 1603
  },
  {
    temperature: 21.4315,
    humidity: 33.2866,
    pressure: 100636.3672,
    gasResistance: 139987.5,
    sensorId: 1,
    createdAt: new Date('2024-01-10T03:14:08.681Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 21.4392,
    humidity: 33.171,
    pressure: 100613.0234,
    gasResistance: 138831.5469,
    sensorId: 1,
    createdAt: new Date('2024-01-10T03:21:32.968Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 21.4443,
    humidity: 33.2212,
    pressure: 100611.1328,
    gasResistance: 133964.1406,
    sensorId: 1,
    createdAt: new Date('2024-01-10T03:22:34.725Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 21.457,
    humidity: 33.2667,
    pressure: 100621.4609,
    gasResistance: 129626.0625,
    sensorId: 1,
    createdAt: new Date('2024-01-10T03:23:09.774Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 21.4775,
    humidity: 33.2242,
    pressure: 100605.7109,
    gasResistance: 131656.2188,
    sensorId: 1,
    createdAt: new Date('2024-01-10T03:29:55.085Z'),
    batteryPercentage: 1603
  },
  {
    temperature: 21.4775,
    humidity: 33.1965,
    pressure: 100605.7109,
    gasResistance: 124721.8047,
    sensorId: 1,
    createdAt: new Date('2024-01-10T03:30:12.35Z'),
    batteryPercentage: 1519
  },
  {
    temperature: 21.4213,
    humidity: 33.269,
    pressure: 100604.5781,
    gasResistance: 128732.7734,
    sensorId: 1,
    createdAt: new Date('2024-01-10T03:38:16.407Z'),
    batteryPercentage: 1603
  },
  {
    temperature: 21.3907,
    humidity: 33.2663,
    pressure: 100615.8984,
    gasResistance: 129526.1953,
    sensorId: 1,
    createdAt: new Date('2024-01-10T03:46:47.208Z'),
    batteryPercentage: 1603
  },
  {
    temperature: 21.4035,
    humidity: 33.2951,
    pressure: 100618.0078,
    gasResistance: 124352.8125,
    sensorId: 1,
    createdAt: new Date('2024-01-10T03:47:22.369Z'),
    batteryPercentage: 1603
  },
  {
    temperature: 21.3984,
    humidity: 33.2947,
    pressure: 100608.9688,
    gasResistance: 127463.9844,
    sensorId: 1,
    createdAt: new Date('2024-01-10T03:55:34.802Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 21.3754,
    humidity: 33.4589,
    pressure: 100605.1484,
    gasResistance: 129227.5156,
    sensorId: 1,
    createdAt: new Date('2024-01-10T04:03:20.739Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 21.3397,
    humidity: 33.1953,
    pressure: 100612.8828,
    gasResistance: 130329.4531,
    sensorId: 1,
    createdAt: new Date('2024-01-10T04:12:00.042Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 21.355,
    humidity: 33.2354,
    pressure: 100607.2266,
    gasResistance: 132173.75,
    sensorId: 1,
    createdAt: new Date('2024-01-10T04:20:03.683Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 21.3269,
    humidity: 33.8321,
    pressure: 100599.8125,
    gasResistance: 133115.5938,
    sensorId: 1,
    createdAt: new Date('2024-01-10T04:29:00.398Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 21.3626,
    humidity: 34.5319,
    pressure: 100603.0234,
    gasResistance: 131142.7344,
    sensorId: 1,
    createdAt: new Date('2024-01-10T04:36:46.727Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 21.4188,
    humidity: 34.4087,
    pressure: 100604.1562,
    gasResistance: 127560.7031,
    sensorId: 1,
    createdAt: new Date('2024-01-10T04:45:08.362Z'),
    batteryPercentage: 1582
  },
  {
    temperature: 21.3933,
    humidity: 33.9048,
    pressure: 100619.0625,
    gasResistance: 126600.1484,
    sensorId: 1,
    createdAt: new Date('2024-01-10T04:54:14.285Z'),
    batteryPercentage: 1601
  },
  {
    temperature: 21.3933,
    humidity: 33.7047,
    pressure: 100627.2734,
    gasResistance: 126030.7344,
    sensorId: 1,
    createdAt: new Date('2024-01-10T05:02:36.838Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 21.4188,
    humidity: 33.6904,
    pressure: 100623.2891,
    gasResistance: 125936.3359,
    sensorId: 1,
    createdAt: new Date('2024-01-10T05:10:12.556Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 21.4086,
    humidity: 33.3233,
    pressure: 100616.1406,
    gasResistance: 126695.5547,
    sensorId: 1,
    createdAt: new Date('2024-01-10T05:18:52.611Z'),
    batteryPercentage: 1585
  },
  {
    temperature: 21.3601,
    humidity: 33.009,
    pressure: 100619,
    gasResistance: 127949.0078,
    sensorId: 1,
    createdAt: new Date('2024-01-10T05:26:55.831Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 21.3371,
    humidity: 33.4499,
    pressure: 100623.4062,
    gasResistance: 128831.4219,
    sensorId: 1,
    createdAt: new Date('2024-01-10T05:35:17.312Z'),
    batteryPercentage: 1542
  },
  {
    temperature: 21.3397,
    humidity: 33.306,
    pressure: 100623.8203,
    gasResistance: 130228.4922,
    sensorId: 1,
    createdAt: new Date('2024-01-10T05:44:15.4Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 21.3218,
    humidity: 33.3266,
    pressure: 100631.7969,
    gasResistance: 129926.5859,
    sensorId: 1,
    createdAt: new Date('2024-01-10T05:52:09.362Z'),
    batteryPercentage: 1601
  },
  {
    temperature: 21.2733,
    humidity: 33.5107,
    pressure: 100620.9844,
    gasResistance: 130430.5625,
    sensorId: 1,
    createdAt: new Date('2024-01-10T06:00:31.16Z'),
    batteryPercentage: 1601
  },
  {
    temperature: 21.2682,
    humidity: 32.9842,
    pressure: 100614.6641,
    gasResistance: 130836.5781,
    sensorId: 1,
    createdAt: new Date('2024-01-10T06:09:09.872Z'),
    batteryPercentage: 1601
  },
  {
    temperature: 21.2886,
    humidity: 32.8645,
    pressure: 100615.3281,
    gasResistance: 132277.7344,
    sensorId: 1,
    createdAt: new Date('2024-01-10T06:17:04.58Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 21.2631,
    humidity: 33.7151,
    pressure: 100608.3594,
    gasResistance: 132590.6875,
    sensorId: 1,
    createdAt: new Date('2024-01-10T06:26:20.66Z'),
    batteryPercentage: 1600
  },
  {
    temperature: 21.2631,
    humidity: 35.4134,
    pressure: 100600.1562,
    gasResistance: 130228.4922,
    sensorId: 1,
    createdAt: new Date('2024-01-10T06:33:57.313Z'),
    batteryPercentage: 1600
  },
  {
    temperature: 21.2197,
    humidity: 34.9717,
    pressure: 100601.1328,
    gasResistance: 130127.7109,
    sensorId: 1,
    createdAt: new Date('2024-01-10T06:42:46.142Z'),
    batteryPercentage: 1599
  },
  {
    temperature: 21.2019,
    humidity: 34.5617,
    pressure: 100598.1641,
    gasResistance: 130836.5781,
    sensorId: 1,
    createdAt: new Date('2024-01-10T06:50:29.808Z'),
    batteryPercentage: 1600
  },
  {
    temperature: 21.133,
    humidity: 34.1482,
    pressure: 100592.1641,
    gasResistance: 133857.4844,
    sensorId: 1,
    createdAt: new Date('2024-01-10T06:59:18.323Z'),
    batteryPercentage: 1600
  },
  {
    temperature: 21.1279,
    humidity: 33.764,
    pressure: 100583.1328,
    gasResistance: 136575.9531,
    sensorId: 1,
    createdAt: new Date('2024-01-10T07:07:31.424Z'),
    batteryPercentage: 1600
  },
  {
    temperature: 21.1585,
    humidity: 32.489,
    pressure: 100585.4766,
    gasResistance: 138946.2812,
    sensorId: 1,
    createdAt: new Date('2024-01-10T07:16:11.867Z'),
    batteryPercentage: 1538
  },
  {
    temperature: 21.2121,
    humidity: 31.9111,
    pressure: 100588.9141,
    gasResistance: 140808.2188,
    sensorId: 1,
    createdAt: new Date('2024-01-10T07:24:41.72Z'),
    batteryPercentage: 1599
  },
  {
    temperature: 21.2121,
    humidity: 31.977,
    pressure: 100588.9141,
    gasResistance: 136354.4219,
    sensorId: 1,
    createdAt: new Date('2024-01-10T07:25:51.908Z'),
    batteryPercentage: 1598
  },
  {
    temperature: 21.2453,
    humidity: 31.4212,
    pressure: 100578.0469,
    gasResistance: 138260.6875,
    sensorId: 1,
    createdAt: new Date('2024-01-10T07:32:36.514Z'),
    batteryPercentage: 1599
  },
  {
    temperature: 21.2402,
    humidity: 30.7445,
    pressure: 100574.4531,
    gasResistance: 141044.4688,
    sensorId: 1,
    createdAt: new Date('2024-01-10T07:41:14.398Z'),
    batteryPercentage: 1537
  },
  {
    temperature: 21.2733,
    humidity: 30.8017,
    pressure: 100571.7656,
    gasResistance: 143206.9844,
    sensorId: 1,
    createdAt: new Date('2024-01-10T07:50:12.208Z'),
    batteryPercentage: 1599
  },
  {
    temperature: 21.332,
    humidity: 32.5814,
    pressure: 100576.0625,
    gasResistance: 144065.9844,
    sensorId: 1,
    createdAt: new Date('2024-01-10T07:57:48.726Z'),
    batteryPercentage: 1597
  },
  {
    temperature: 21.3295,
    humidity: 31.5596,
    pressure: 100572.8984,
    gasResistance: 145815.2656,
    sensorId: 1,
    createdAt: new Date('2024-01-10T08:05:42.8Z'),
    batteryPercentage: 1599
  },
  {
    temperature: 21.2733,
    humidity: 30.9106,
    pressure: 100582.6953,
    gasResistance: 148389.2188,
    sensorId: 1,
    createdAt: new Date('2024-01-10T08:14:04.073Z'),
    batteryPercentage: 1597
  },
  {
    temperature: 21.2759,
    humidity: 30.7964,
    pressure: 100594.0625,
    gasResistance: 143085.0938,
    sensorId: 1,
    createdAt: new Date('2024-01-10T08:15:23.363Z'),
    batteryPercentage: 1597
  },
  {
    temperature: 21.2835,
    humidity: 33.1792,
    pressure: 100584.4062,
    gasResistance: 146450.3438,
    sensorId: 1,
    createdAt: new Date('2024-01-10T08:23:18.957Z'),
    batteryPercentage: 1598
  },
  {
    temperature: 21.2682,
    humidity: 32.0038,
    pressure: 100590.0547,
    gasResistance: 147737.2656,
    sensorId: 1,
    createdAt: new Date('2024-01-10T08:32:20.952Z'),
    batteryPercentage: 1596
  },
  {
    temperature: 21.3039,
    humidity: 31.3223,
    pressure: 100598.75,
    gasResistance: 149977.7031,
    sensorId: 1,
    createdAt: new Date('2024-01-10T08:40:56.357Z'),
    batteryPercentage: 1596
  },
  {
    temperature: 21.2988,
    humidity: 30.9018,
    pressure: 100603.3516,
    gasResistance: 151055.7031,
    sensorId: 1,
    createdAt: new Date('2024-01-10T08:47:30.147Z'),
    batteryPercentage: 1596
  },
  {
    temperature: 21.2325,
    humidity: 30.4015,
    pressure: 100611.4531,
    gasResistance: 154101.75,
    sensorId: 1,
    createdAt: new Date('2024-01-10T08:56:09.342Z'),
    batteryPercentage: 1596
  },
  {
    temperature: 21.2197,
    humidity: 30.1131,
    pressure: 100598.3984,
    gasResistance: 156540.9688,
    sensorId: 1,
    createdAt: new Date('2024-01-10T09:04:39.274Z'),
    batteryPercentage: 1595
  },
  {
    temperature: 21.2325,
    humidity: 29.7679,
    pressure: 100600.5156,
    gasResistance: 159511.375,
    sensorId: 1,
    createdAt: new Date('2024-01-10T09:13:39.381Z'),
    batteryPercentage: 1595
  },
  {
    temperature: 21.2427,
    humidity: 29.8066,
    pressure: 100602.2266,
    gasResistance: 150784.75,
    sensorId: 1,
    createdAt: new Date('2024-01-10T09:14:14.683Z'),
    batteryPercentage: 1595
  },
  {
    temperature: 22.3833,
    humidity: 31.1578,
    pressure: 100561.8828,
    gasResistance: 160271.6875,
    sensorId: 1,
    createdAt: new Date('2024-01-10T10:03:53.278Z'),
    batteryPercentage: 1596
  },
  {
    temperature: 22.2838,
    humidity: 31.5105,
    pressure: 100570.0234,
    gasResistance: 158012.2188,
    sensorId: 1,
    createdAt: new Date('2024-01-10T10:08:01.238Z'),
    batteryPercentage: 1594
  },
  {
    temperature: 21.6765,
    humidity: 31.2449,
    pressure: 100570.4062,
    gasResistance: 163069.8438,
    sensorId: 1,
    createdAt: new Date('2024-01-10T10:17:35.662Z'),
    batteryPercentage: 1581
  },
  {
    temperature: 21.4698,
    humidity: 30.7366,
    pressure: 100566.1328,
    gasResistance: 160271.6875,
    sensorId: 1,
    createdAt: new Date('2024-01-10T10:27:16.672Z'),
    batteryPercentage: 1582
  },
  {
    temperature: 21.4494,
    humidity: 30.3816,
    pressure: 100568.2266,
    gasResistance: 162754.1094,
    sensorId: 1,
    createdAt: new Date('2024-01-10T10:34:52.996Z'),
    batteryPercentage: 1585
  },
  {
    temperature: 21.4111,
    humidity: 30.3947,
    pressure: 100561.8672,
    gasResistance: 164024.3906,
    sensorId: 1,
    createdAt: new Date('2024-01-10T10:42:01.954Z'),
    batteryPercentage: 1585
  },
  {
    temperature: 21.3065,
    humidity: 30.2937,
    pressure: 100549.9297,
    gasResistance: 167455.1719,
    sensorId: 1,
    createdAt: new Date('2024-01-10T10:50:50.333Z'),
    batteryPercentage: 1584
  },
  {
    temperature: 22.2634,
    humidity: 35.5872,
    pressure: 100550.1953,
    gasResistance: 157567.9375,
    sensorId: 1,
    createdAt: new Date('2024-01-10T10:53:26.063Z'),
    batteryPercentage: 1596
  },
  {
    temperature: 21.5285,
    humidity: 30.475,
    pressure: 100532.1172,
    gasResistance: 161503.3594,
    sensorId: 1,
    createdAt: new Date('2024-01-10T11:02:45.997Z'),
    batteryPercentage: 1616
  },
  {
    temperature: 21.258,
    humidity: 30.2029,
    pressure: 100539.1406,
    gasResistance: 163228.1562,
    sensorId: 1,
    createdAt: new Date('2024-01-10T11:12:16.334Z'),
    batteryPercentage: 1615
  },
  {
    temperature: 21.1304,
    humidity: 29.9704,
    pressure: 100515.1953,
    gasResistance: 164990.1875,
    sensorId: 1,
    createdAt: new Date('2024-01-10T11:21:46.668Z'),
    batteryPercentage: 1615
  },
  {
    temperature: 21.1406,
    humidity: 29.9604,
    pressure: 100516.8906,
    gasResistance: 154243.1094,
    sensorId: 1,
    createdAt: new Date('2024-01-10T11:22:04.18Z'),
    batteryPercentage: 1615
  },
  {
    temperature: 21.0743,
    humidity: 29.8685,
    pressure: 100511.3359,
    gasResistance: 160271.6875,
    sensorId: 1,
    createdAt: new Date('2024-01-10T11:31:17.135Z'),
    batteryPercentage: 1616
  },
  {
    temperature: 21.0131,
    humidity: 30.2206,
    pressure: 100506.625,
    gasResistance: 162439.625,
    sensorId: 1,
    createdAt: new Date('2024-01-10T11:40:47.324Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 21.0156,
    humidity: 30.8127,
    pressure: 100504.3125,
    gasResistance: 151874.4219,
    sensorId: 1,
    createdAt: new Date('2024-01-10T11:41:04.619Z'),
    batteryPercentage: 1565
  },
  {
    temperature: 20.9748,
    humidity: 30.1362,
    pressure: 100492.0703,
    gasResistance: 157567.9375,
    sensorId: 1,
    createdAt: new Date('2024-01-10T11:50:17.702Z'),
    batteryPercentage: 1615
  },
  {
    temperature: 20.9773,
    humidity: 30.1798,
    pressure: 100487.0234,
    gasResistance: 159662.8594,
    sensorId: 1,
    createdAt: new Date('2024-01-10T11:59:48.037Z'),
    batteryPercentage: 1616
  },
  {
    temperature: 20.9901,
    humidity: 30.1808,
    pressure: 100486.3984,
    gasResistance: 149577.4062,
    sensorId: 1,
    createdAt: new Date('2024-01-10T12:00:05.332Z'),
    batteryPercentage: 1566
  },
  {
    temperature: 21.0233,
    humidity: 30.1131,
    pressure: 100478.2422,
    gasResistance: 155815.5625,
    sensorId: 1,
    createdAt: new Date('2024-01-10T12:09:18.316Z'),
    batteryPercentage: 1615
  },
  {
    temperature: 21.0003,
    humidity: 30.2304,
    pressure: 100482.6406,
    gasResistance: 157715.7656,
    sensorId: 1,
    createdAt: new Date('2024-01-10T12:18:48.64Z'),
    batteryPercentage: 1568
  },
  {
    temperature: 20.9824,
    humidity: 30.3482,
    pressure: 100471.4688,
    gasResistance: 158012.2188,
    sensorId: 1,
    createdAt: new Date('2024-01-10T12:28:19.124Z'),
    batteryPercentage: 1616
  },
  {
    temperature: 20.9595,
    humidity: 30.5036,
    pressure: 100451.25,
    gasResistance: 157863.8594,
    sensorId: 1,
    createdAt: new Date('2024-01-10T12:37:49.348Z'),
    batteryPercentage: 1616
  },
  {
    temperature: 20.9289,
    humidity: 34.8998,
    pressure: 100457.0859,
    gasResistance: 155671.2969,
    sensorId: 1,
    createdAt: new Date('2024-01-10T12:47:19.58Z'),
    batteryPercentage: 1616
  },
  {
    temperature: 20.888,
    humidity: 30.8292,
    pressure: 100444.8516,
    gasResistance: 152149.3281,
    sensorId: 1,
    createdAt: new Date('2024-01-10T12:56:49.913Z'),
    batteryPercentage: 1616
  },
  {
    temperature: 20.9518,
    humidity: 32.8126,
    pressure: 100436.3047,
    gasResistance: 153258.8906,
    sensorId: 1,
    createdAt: new Date('2024-01-10T13:06:20.252Z'),
    batteryPercentage: 1615
  },
  {
    temperature: 20.9161,
    humidity: 35.4425,
    pressure: 100435.8438,
    gasResistance: 149977.7031,
    sensorId: 1,
    createdAt: new Date('2024-01-10T13:15:50.582Z'),
    batteryPercentage: 1616
  },
  {
    temperature: 20.8906,
    humidity: 35.7211,
    pressure: 100426.1406,
    gasResistance: 146068.6406,
    sensorId: 1,
    createdAt: new Date('2024-01-10T13:25:20.964Z'),
    batteryPercentage: 1616
  },
  {
    temperature: 20.837,
    humidity: 34.785,
    pressure: 100428.1641,
    gasResistance: 139987.5,
    sensorId: 1,
    createdAt: new Date('2024-01-10T13:34:51.196Z'),
    batteryPercentage: 1615
  },
  {
    temperature: 20.7809,
    humidity: 34.1328,
    pressure: 100429.7656,
    gasResistance: 135475.4219,
    sensorId: 1,
    createdAt: new Date('2024-01-10T13:44:21.522Z'),
    batteryPercentage: 1616
  },
  {
    temperature: 20.763,
    humidity: 34.1311,
    pressure: 100421.3516,
    gasResistance: 131347.6562,
    sensorId: 1,
    createdAt: new Date('2024-01-10T13:53:51.867Z'),
    batteryPercentage: 1615
  },
  {
    temperature: 20.7579,
    humidity: 34.32,
    pressure: 100406.8281,
    gasResistance: 128634.2734,
    sensorId: 1,
    createdAt: new Date('2024-01-10T14:03:22.198Z'),
    batteryPercentage: 1615
  },
  {
    temperature: 20.7426,
    humidity: 34.3911,
    pressure: 100415.2266,
    gasResistance: 125186.1562,
    sensorId: 1,
    createdAt: new Date('2024-01-10T14:12:52.542Z'),
    batteryPercentage: 1564
  },
  {
    temperature: 20.7094,
    humidity: 34.0261,
    pressure: 100412.4375,
    gasResistance: 122718.9844,
    sensorId: 1,
    createdAt: new Date('2024-01-10T14:22:23.024Z'),
    batteryPercentage: 1615
  },
  {
    temperature: 20.689,
    humidity: 33.7576,
    pressure: 100398.1172,
    gasResistance: 120519.7188,
    sensorId: 1,
    createdAt: new Date('2024-01-10T14:31:53.371Z'),
    batteryPercentage: 1564
  },
  {
    temperature: 20.6711,
    humidity: 31.1158,
    pressure: 100400.6172,
    gasResistance: 122718.9844,
    sensorId: 1,
    createdAt: new Date('2024-01-10T14:41:23.584Z'),
    batteryPercentage: 1614
  },
  {
    temperature: 20.7018,
    humidity: 32.6362,
    pressure: 100392.0469,
    gasResistance: 126314.8047,
    sensorId: 1,
    createdAt: new Date('2024-01-10T14:50:53.863Z'),
    batteryPercentage: 1616
  },
  {
    temperature: 20.7196,
    humidity: 33.3889,
    pressure: 100405.9297,
    gasResistance: 131142.7344,
    sensorId: 1,
    createdAt: new Date('2024-01-10T15:00:24.735Z'),
    batteryPercentage: 1615
  },
  {
    temperature: 20.7145,
    humidity: 31.8682,
    pressure: 100394.1641,
    gasResistance: 133115.5938,
    sensorId: 1,
    createdAt: new Date('2024-01-10T15:09:54.685Z'),
    batteryPercentage: 1615
  },
  {
    temperature: 20.7732,
    humidity: 31.3863,
    pressure: 100392.9922,
    gasResistance: 137694.5156,
    sensorId: 1,
    createdAt: new Date('2024-01-10T15:19:25.509Z'),
    batteryPercentage: 1565
  },
  {
    temperature: 20.7732,
    humidity: 32.6976,
    pressure: 100379.3359,
    gasResistance: 140221.0156,
    sensorId: 1,
    createdAt: new Date('2024-01-10T15:28:55.201Z'),
    batteryPercentage: 1615
  },
  {
    temperature: 20.7706,
    humidity: 33.9927,
    pressure: 100376.1641,
    gasResistance: 139522.8281,
    sensorId: 1,
    createdAt: new Date('2024-01-10T15:38:25.598Z'),
    batteryPercentage: 1615
  },
  {
    temperature: 20.7655,
    humidity: 34.2929,
    pressure: 100375.3203,
    gasResistance: 138717,
    sensorId: 1,
    createdAt: new Date('2024-01-10T15:47:55.98Z'),
    batteryPercentage: 1615
  },
  {
    temperature: 20.7502,
    humidity: 34.6932,
    pressure: 100350.9219,
    gasResistance: 137694.5156,
    sensorId: 1,
    createdAt: new Date('2024-01-10T15:57:26.134Z'),
    batteryPercentage: 1615
  },
  {
    temperature: 20.7502,
    humidity: 33.1482,
    pressure: 100345.4531,
    gasResistance: 136354.4219,
    sensorId: 1,
    createdAt: new Date('2024-01-10T16:06:56.354Z'),
    batteryPercentage: 1563
  },
  {
    temperature: 20.7426,
    humidity: 33.5073,
    pressure: 100344.1875,
    gasResistance: 135366.3438,
    sensorId: 1,
    createdAt: new Date('2024-01-10T16:16:26.881Z'),
    batteryPercentage: 1615
  },
  {
    temperature: 20.7809,
    humidity: 31.1142,
    pressure: 100339.6016,
    gasResistance: 137357.0312,
    sensorId: 1,
    createdAt: new Date('2024-01-10T16:25:56.981Z'),
    batteryPercentage: 1614
  },
  {
    temperature: 20.7911,
    humidity: 30.7503,
    pressure: 100333.1172,
    gasResistance: 138831.5469,
    sensorId: 1,
    createdAt: new Date('2024-01-10T16:35:27.418Z'),
    batteryPercentage: 1615
  },
  {
    temperature: 20.7987,
    humidity: 31.8973,
    pressure: 100331.6484,
    gasResistance: 140104.1562,
    sensorId: 1,
    createdAt: new Date('2024-01-10T16:44:57.793Z'),
    batteryPercentage: 1614
  },
  {
    temperature: 20.8064,
    humidity: 31.0728,
    pressure: 100335.6562,
    gasResistance: 130836.5781,
    sensorId: 1,
    createdAt: new Date('2024-01-10T16:45:15.041Z'),
    batteryPercentage: 1563
  },
  {
    temperature: 20.8166,
    humidity: 30.8612,
    pressure: 100329.1484,
    gasResistance: 135803.7188,
    sensorId: 1,
    createdAt: new Date('2024-01-10T16:54:27.976Z'),
    batteryPercentage: 1614
  },
  {
    temperature: 20.8038,
    humidity: 31.4545,
    pressure: 100329.7656,
    gasResistance: 134607.6875,
    sensorId: 1,
    createdAt: new Date('2024-01-10T17:03:58.241Z'),
    batteryPercentage: 1614
  },
  {
    temperature: 20.8421,
    humidity: 31.7203,
    pressure: 100336.1172,
    gasResistance: 135040.1719,
    sensorId: 1,
    createdAt: new Date('2024-01-10T17:13:28.653Z'),
    batteryPercentage: 1613
  },
  {
    temperature: 20.8702,
    humidity: 32.2658,
    pressure: 100335.3047,
    gasResistance: 135040.1719,
    sensorId: 1,
    createdAt: new Date('2024-01-10T17:22:58.858Z'),
    batteryPercentage: 1614
  },
  {
    temperature: 20.8957,
    humidity: 32.3505,
    pressure: 100334.0703,
    gasResistance: 134392.4844,
    sensorId: 1,
    createdAt: new Date('2024-01-10T17:32:29.219Z'),
    batteryPercentage: 1614
  },
  {
    temperature: 20.9237,
    humidity: 32.7218,
    pressure: 100327.8047,
    gasResistance: 133538.5312,
    sensorId: 1,
    createdAt: new Date('2024-01-10T17:41:59.489Z'),
    batteryPercentage: 1614
  },
  {
    temperature: 20.9212,
    humidity: 32.9147,
    pressure: 100324.6484,
    gasResistance: 125653.9609,
    sensorId: 1,
    createdAt: new Date('2024-01-10T17:42:16.743Z'),
    batteryPercentage: 1562
  },
  {
    temperature: 20.9569,
    humidity: 33.7874,
    pressure: 100319.6484,
    gasResistance: 128831.4219,
    sensorId: 1,
    createdAt: new Date('2024-01-10T17:51:29.958Z'),
    batteryPercentage: 1614
  },
  {
    temperature: 20.9059,
    humidity: 33.4222,
    pressure: 100308.4531,
    gasResistance: 127657.5469,
    sensorId: 1,
    createdAt: new Date('2024-01-10T18:01:00.125Z'),
    batteryPercentage: 1613
  },
  {
    temperature: 20.8804,
    humidity: 35.0073,
    pressure: 100298.75,
    gasResistance: 125093.0078,
    sensorId: 1,
    createdAt: new Date('2024-01-10T18:10:30.524Z'),
    batteryPercentage: 1613
  },
  {
    temperature: 20.8574,
    humidity: 34.91,
    pressure: 100289.4766,
    gasResistance: 123258.7969,
    sensorId: 1,
    createdAt: new Date('2024-01-10T18:20:00.87Z'),
    batteryPercentage: 1613
  },
  {
    temperature: 20.8421,
    humidity: 34.6179,
    pressure: 100281.4609,
    gasResistance: 122450.8359,
    sensorId: 1,
    createdAt: new Date('2024-01-10T18:29:31.255Z'),
    batteryPercentage: 1613
  },
  {
    temperature: 20.8319,
    humidity: 34.2377,
    pressure: 100279.7578,
    gasResistance: 121829.7031,
    sensorId: 1,
    createdAt: new Date('2024-01-10T18:39:01.421Z'),
    batteryPercentage: 1613
  },
  {
    temperature: 20.8268,
    humidity: 34.0145,
    pressure: 100278.9219,
    gasResistance: 122361.7109,
    sensorId: 1,
    createdAt: new Date('2024-01-10T18:48:33.817Z'),
    batteryPercentage: 1613
  },
  {
    temperature: 20.8268,
    humidity: 33.82,
    pressure: 100265.2578,
    gasResistance: 122988.3047,
    sensorId: 1,
    createdAt: new Date('2024-01-10T18:58:02.177Z'),
    batteryPercentage: 1613
  },
  {
    temperature: 20.8293,
    humidity: 33.7703,
    pressure: 100257.5,
    gasResistance: 123349.2344,
    sensorId: 1,
    createdAt: new Date('2024-01-10T19:07:32.806Z'),
    batteryPercentage: 1613
  },
  {
    temperature: 20.8268,
    humidity: 33.7312,
    pressure: 100257.0625,
    gasResistance: 123439.7969,
    sensorId: 1,
    createdAt: new Date('2024-01-10T19:17:02.615Z'),
    batteryPercentage: 1613
  },
  {
    temperature: 20.8319,
    humidity: 33.6595,
    pressure: 100252.4375,
    gasResistance: 123530.5,
    sensorId: 1,
    createdAt: new Date('2024-01-10T19:26:33.099Z'),
    batteryPercentage: 1612
  },
  {
    temperature: 20.837,
    humidity: 33.61,
    pressure: 100264.2266,
    gasResistance: 123894.6094,
    sensorId: 1,
    createdAt: new Date('2024-01-10T19:36:03.191Z'),
    batteryPercentage: 1612
  },
  {
    temperature: 20.8293,
    humidity: 33.3212,
    pressure: 100257.5,
    gasResistance: 124629.3438,
    sensorId: 1,
    createdAt: new Date('2024-01-10T19:45:33.627Z'),
    batteryPercentage: 1613
  },
  {
    temperature: 20.8217,
    humidity: 32.9611,
    pressure: 100242.5547,
    gasResistance: 125842.0703,
    sensorId: 1,
    createdAt: new Date('2024-01-10T19:55:03.802Z'),
    batteryPercentage: 1613
  },
  {
    temperature: 20.8191,
    humidity: 32.6575,
    pressure: 100255.7891,
    gasResistance: 126600.1484,
    sensorId: 1,
    createdAt: new Date('2024-01-10T20:04:34.164Z'),
    batteryPercentage: 1612
  },
  {
    temperature: 20.8293,
    humidity: 32.9508,
    pressure: 100257.5,
    gasResistance: 127271,
    sensorId: 1,
    createdAt: new Date('2024-01-10T20:14:04.53Z'),
    batteryPercentage: 1612
  },
  {
    temperature: 20.837,
    humidity: 32.8686,
    pressure: 100261.4922,
    gasResistance: 127657.5469,
    sensorId: 1,
    createdAt: new Date('2024-01-10T20:23:34.679Z'),
    batteryPercentage: 1613
  },
  {
    temperature: 20.8727,
    humidity: 30.9041,
    pressure: 100253.75,
    gasResistance: 128241.8047,
    sensorId: 1,
    createdAt: new Date('2024-01-10T20:33:05.052Z'),
    batteryPercentage: 1613
  },
  {
    temperature: 20.9952,
    humidity: 32.8826,
    pressure: 100246.7344,
    gasResistance: 131245.125,
    sensorId: 1,
    createdAt: new Date('2024-01-10T20:42:35.438Z'),
    batteryPercentage: 1612
  },
  {
    temperature: 21.1228,
    humidity: 33.2976,
    pressure: 100259.6953,
    gasResistance: 132277.7344,
    sensorId: 1,
    createdAt: new Date('2024-01-10T20:52:06.224Z'),
    batteryPercentage: 1613
  },
  {
    temperature: 21.2121,
    humidity: 33.3167,
    pressure: 100249.8906,
    gasResistance: 133010.2812,
    sensorId: 1,
    createdAt: new Date('2024-01-10T21:01:35.879Z'),
    batteryPercentage: 1613
  },
  {
    temperature: 21.2784,
    humidity: 32.9409,
    pressure: 100244.4844,
    gasResistance: 133751,
    sensorId: 1,
    createdAt: new Date('2024-01-10T21:11:06.354Z'),
    batteryPercentage: 1613
  },
  {
    temperature: 21.3346,
    humidity: 33.5661,
    pressure: 100237.3828,
    gasResistance: 133964.1406,
    sensorId: 1,
    createdAt: new Date('2024-01-10T21:20:36.516Z'),
    batteryPercentage: 1614
  },
  {
    temperature: 21.4035,
    humidity: 33.5391,
    pressure: 100237.8594,
    gasResistance: 134070.9688,
    sensorId: 1,
    createdAt: new Date('2024-01-10T21:30:06.822Z'),
    batteryPercentage: 1613
  },
  {
    temperature: 21.3907,
    humidity: 33.3328,
    pressure: 100230.2812,
    gasResistance: 134392.4844,
    sensorId: 1,
    createdAt: new Date('2024-01-10T21:39:37.086Z'),
    batteryPercentage: 1613
  },
  {
    temperature: 21.4366,
    humidity: 33.1541,
    pressure: 100232.4297,
    gasResistance: 134500,
    sensorId: 1,
    createdAt: new Date('2024-01-10T21:49:07.427Z'),
    batteryPercentage: 1613
  },
  {
    temperature: 21.4672,
    humidity: 33.0683,
    pressure: 100248.4375,
    gasResistance: 134823.5781,
    sensorId: 1,
    createdAt: new Date('2024-01-10T21:58:37.787Z'),
    batteryPercentage: 1561
  },
  {
    temperature: 21.5412,
    humidity: 32.9809,
    pressure: 100249.7578,
    gasResistance: 135257.4375,
    sensorId: 1,
    createdAt: new Date('2024-01-10T22:08:08.019Z'),
    batteryPercentage: 1599
  },
  {
    temperature: 21.5591,
    humidity: 32.9107,
    pressure: 100247.2656,
    gasResistance: 135913.5,
    sensorId: 1,
    createdAt: new Date('2024-01-10T22:17:38.343Z'),
    batteryPercentage: 1613
  },
  {
    temperature: 21.6025,
    humidity: 32.8427,
    pressure: 100232.5547,
    gasResistance: 136686.9844,
    sensorId: 1,
    createdAt: new Date('2024-01-10T22:27:08.649Z'),
    batteryPercentage: 1614
  },
  {
    temperature: 21.6306,
    humidity: 33.3488,
    pressure: 100215.3281,
    gasResistance: 136909.6094,
    sensorId: 1,
    createdAt: new Date('2024-01-10T22:36:39.085Z'),
    batteryPercentage: 1614
  },
  {
    temperature: 21.6739,
    humidity: 33.4415,
    pressure: 100208.8281,
    gasResistance: 137132.9531,
    sensorId: 1,
    createdAt: new Date('2024-01-10T22:46:09.274Z'),
    batteryPercentage: 1613
  },
  {
    temperature: 21.6892,
    humidity: 33.3763,
    pressure: 100205.8906,
    gasResistance: 137469.3438,
    sensorId: 1,
    createdAt: new Date('2024-01-10T22:55:39.6Z'),
    batteryPercentage: 1613
  },
  {
    temperature: 21.7352,
    humidity: 33.7747,
    pressure: 100197.0859,
    gasResistance: 137357.0312,
    sensorId: 1,
    createdAt: new Date('2024-01-10T23:05:09.927Z'),
    batteryPercentage: 1613
  },
  {
    temperature: 21.8117,
    humidity: 33.7205,
    pressure: 100157.7656,
    gasResistance: 137244.8906,
    sensorId: 1,
    createdAt: new Date('2024-01-10T23:14:40.241Z'),
    batteryPercentage: 1613
  },
  {
    temperature: 21.9138,
    humidity: 33.9691,
    pressure: 100144.5469,
    gasResistance: 136575.9531,
    sensorId: 1,
    createdAt: new Date('2024-01-10T23:24:10.728Z'),
    batteryPercentage: 1613
  },
  {
    temperature: 21.9138,
    humidity: 34.6782,
    pressure: 100108.9688,
    gasResistance: 135366.3438,
    sensorId: 1,
    createdAt: new Date('2024-01-10T23:33:40.852Z'),
    batteryPercentage: 1612
  },
  {
    temperature: 21.9214,
    humidity: 34.6621,
    pressure: 100104.7734,
    gasResistance: 127657.5469,
    sensorId: 1,
    createdAt: new Date('2024-01-10T23:33:59.113Z'),
    batteryPercentage: 1612
  },
  {
    temperature: 21.9189,
    humidity: 34.1145,
    pressure: 100109.8203,
    gasResistance: 130836.5781,
    sensorId: 1,
    createdAt: new Date('2024-01-10T23:43:11.268Z'),
    batteryPercentage: 1612
  },
  {
    temperature: 21.8679,
    humidity: 33.9037,
    pressure: 100098.6406,
    gasResistance: 131656.2188,
    sensorId: 1,
    createdAt: new Date('2024-01-10T23:52:42.045Z'),
    batteryPercentage: 1612
  },
  {
    temperature: 21.8806,
    humidity: 33.8492,
    pressure: 100103.5,
    gasResistance: 123712.2969,
    sensorId: 1,
    createdAt: new Date('2024-01-10T23:52:59.362Z'),
    batteryPercentage: 1560
  },
  {
    temperature: 21.8985,
    humidity: 33.8119,
    pressure: 100084.5547,
    gasResistance: 123258.7969,
    sensorId: 1,
    createdAt: new Date('2024-01-11T00:02:12.018Z'),
    batteryPercentage: 1612
  },
  {
    temperature: 21.8934,
    humidity: 33.6613,
    pressure: 100080.9609,
    gasResistance: 123078.3281,
    sensorId: 1,
    createdAt: new Date('2024-01-11T00:11:42.866Z'),
    batteryPercentage: 1561
  },
  {
    temperature: 21.873,
    humidity: 33.6205,
    pressure: 100061.1641,
    gasResistance: 123168.5,
    sensorId: 1,
    createdAt: new Date('2024-01-11T00:21:12.52Z'),
    batteryPercentage: 1612
  },
  {
    temperature: 21.873,
    humidity: 33.7428,
    pressure: 100058.4375,
    gasResistance: 116430.0625,
    sensorId: 1,
    createdAt: new Date('2024-01-11T00:21:29.764Z'),
    batteryPercentage: 1560
  },
  {
    temperature: 21.8806,
    humidity: 33.8325,
    pressure: 100054.2344,
    gasResistance: 117982.4531,
    sensorId: 1,
    createdAt: new Date('2024-01-11T00:30:42.895Z'),
    batteryPercentage: 1612
  },
  {
    temperature: 21.8704,
    humidity: 33.8594,
    pressure: 100049.8125,
    gasResistance: 118397.8906,
    sensorId: 1,
    createdAt: new Date('2024-01-11T00:40:13.128Z'),
    batteryPercentage: 1613
  },
  {
    temperature: 21.9342,
    humidity: 34.2051,
    pressure: 100060.3594,
    gasResistance: 118984.4375,
    sensorId: 1,
    createdAt: new Date('2024-01-11T00:49:43.467Z'),
    batteryPercentage: 1612
  },
  {
    temperature: 21.9419,
    humidity: 34.1278,
    pressure: 100056.1484,
    gasResistance: 118816.2578,
    sensorId: 1,
    createdAt: new Date('2024-01-11T00:59:13.83Z'),
    batteryPercentage: 1612
  },
  {
    temperature: 21.9291,
    humidity: 34.5957,
    pressure: 100037.6172,
    gasResistance: 118564.8906,
    sensorId: 1,
    createdAt: new Date('2024-01-11T01:08:44.199Z'),
    batteryPercentage: 1613
  },
  {
    temperature: 21.9317,
    humidity: 34.6183,
    pressure: 100032.5703,
    gasResistance: 118397.8906,
    sensorId: 1,
    createdAt: new Date('2024-01-11T01:18:14.461Z'),
    batteryPercentage: 1612
  },
  {
    temperature: 21.9852,
    humidity: 35.2906,
    pressure: 100035.9531,
    gasResistance: 117569.9297,
    sensorId: 1,
    createdAt: new Date('2024-01-11T01:27:44.812Z'),
    batteryPercentage: 1612
  },
  {
    temperature: 22.0388,
    humidity: 35.1159,
    pressure: 100047.5391,
    gasResistance: 117323.7891,
    sensorId: 1,
    createdAt: new Date('2024-01-11T01:37:15.208Z'),
    batteryPercentage: 1613
  },
  {
    temperature: 22.0643,
    humidity: 35.0117,
    pressure: 100035.3281,
    gasResistance: 116997.2109,
    sensorId: 1,
    createdAt: new Date('2024-01-11T01:46:45.528Z'),
    batteryPercentage: 1612
  },
  {
    temperature: 22.0694,
    humidity: 35.3042,
    pressure: 100041.6484,
    gasResistance: 116672.4531,
    sensorId: 1,
    createdAt: new Date('2024-01-11T01:56:15.845Z'),
    batteryPercentage: 1612
  },
  {
    temperature: 22.049,
    humidity: 34.9149,
    pressure: 100019.1172,
    gasResistance: 116834.6016,
    sensorId: 1,
    createdAt: new Date('2024-01-11T02:05:46.24Z'),
    batteryPercentage: 1612
  },
  {
    temperature: 22.0133,
    humidity: 35.1304,
    pressure: 100035.1094,
    gasResistance: 116997.2109,
    sensorId: 1,
    createdAt: new Date('2024-01-11T02:15:16.52Z'),
    batteryPercentage: 1612
  },
  {
    temperature: 22.0057,
    humidity: 35.405,
    pressure: 99998.2734,
    gasResistance: 117323.7891,
    sensorId: 1,
    createdAt: new Date('2024-01-11T02:24:46.974Z'),
    batteryPercentage: 1612
  },
  {
    temperature: 22.0082,
    humidity: 35.5741,
    pressure: 99995.9609,
    gasResistance: 116672.4531,
    sensorId: 1,
    createdAt: new Date('2024-01-11T02:34:17.346Z'),
    batteryPercentage: 1613
  },
  {
    temperature: 21.9878,
    humidity: 35.3639,
    pressure: 99970.6797,
    gasResistance: 115233.0312,
    sensorId: 1,
    createdAt: new Date('2024-01-11T02:43:49.031Z'),
    batteryPercentage: 1612
  },
  {
    temperature: 21.9827,
    humidity: 35.0826,
    pressure: 99958.8984,
    gasResistance: 113063.2188,
    sensorId: 1,
    createdAt: new Date('2024-01-11T02:53:18.077Z'),
    batteryPercentage: 1611
  },
  {
    temperature: 21.9495,
    humidity: 34.9617,
    pressure: 99942.4688,
    gasResistance: 112608.8359,
    sensorId: 1,
    createdAt: new Date('2024-01-11T03:02:48.231Z'),
    batteryPercentage: 1612
  },
  {
    temperature: 21.9291,
    humidity: 34.7132,
    pressure: 99960.9844,
    gasResistance: 112608.8359,
    sensorId: 1,
    createdAt: new Date('2024-01-11T03:12:20.039Z'),
    batteryPercentage: 1612
  },
  {
    temperature: 21.8908,
    humidity: 34.9449,
    pressure: 99965.6172,
    gasResistance: 112458.2031,
    sensorId: 1,
    createdAt: new Date('2024-01-11T03:21:48.899Z'),
    batteryPercentage: 1611
  },
  {
    temperature: 21.8653,
    humidity: 34.6513,
    pressure: 99966.8828,
    gasResistance: 112232.9844,
    sensorId: 1,
    createdAt: new Date('2024-01-11T03:31:19.246Z'),
    batteryPercentage: 1611
  },
  {
    temperature: 21.8117,
    humidity: 34.473,
    pressure: 99971.6953,
    gasResistance: 112008.6641,
    sensorId: 1,
    createdAt: new Date('2024-01-11T03:40:49.736Z'),
    batteryPercentage: 1611
  },
  {
    temperature: 21.8117,
    humidity: 34.4842,
    pressure: 99968.9609,
    gasResistance: 112232.9844,
    sensorId: 1,
    createdAt: new Date('2024-01-11T03:50:20.895Z'),
    batteryPercentage: 1611
  },
  {
    temperature: 21.7734,
    humidity: 34.2796,
    pressure: 99946.2266,
    gasResistance: 112008.6641,
    sensorId: 1,
    createdAt: new Date('2024-01-11T03:59:50.243Z'),
    batteryPercentage: 1612
  },
  {
    temperature: 21.7632,
    humidity: 34.0222,
    pressure: 99941.7969,
    gasResistance: 109385.1641,
    sensorId: 1,
    createdAt: new Date('2024-01-11T04:09:22.614Z'),
    batteryPercentage: 1560
  },
  {
    temperature: 21.776,
    humidity: 34.3859,
    pressure: 99930.2266,
    gasResistance: 109101.2344,
    sensorId: 1,
    createdAt: new Date('2024-01-11T04:18:51.905Z'),
    batteryPercentage: 1611
  },
  {
    temperature: 21.7607,
    humidity: 34.7927,
    pressure: 99914.0078,
    gasResistance: 109030.4766,
    sensorId: 1,
    createdAt: new Date('2024-01-11T04:28:21.245Z'),
    batteryPercentage: 1611
  },
  {
    temperature: 21.7428,
    humidity: 34.8526,
    pressure: 99908.3281,
    gasResistance: 107910.7891,
    sensorId: 1,
    createdAt: new Date('2024-01-11T04:37:52.58Z'),
    batteryPercentage: 1611
  },
  {
    temperature: 21.7479,
    humidity: 34.7579,
    pressure: 99898.2344,
    gasResistance: 102141.5547,
    sensorId: 1,
    createdAt: new Date('2024-01-11T04:38:09.837Z'),
    batteryPercentage: 1556
  },
  {
    temperature: 21.7632,
    humidity: 34.9217,
    pressure: 99895.2812,
    gasResistance: 104685.5625,
    sensorId: 1,
    createdAt: new Date('2024-01-11T04:47:22.551Z'),
    batteryPercentage: 1610
  },
  {
    temperature: 21.7275,
    humidity: 35.1652,
    pressure: 99881.1719,
    gasResistance: 104490.3672,
    sensorId: 1,
    createdAt: new Date('2024-01-11T04:56:52.228Z'),
    batteryPercentage: 1611
  },
  {
    temperature: 21.7071,
    humidity: 34.9837,
    pressure: 99855.9297,
    gasResistance: 104231.2422,
    sensorId: 1,
    createdAt: new Date('2024-01-11T05:06:24.101Z'),
    batteryPercentage: 1611
  },
  {
    temperature: 21.6867,
    humidity: 34.6347,
    pressure: 99847.0859,
    gasResistance: 104425.4688,
    sensorId: 1,
    createdAt: new Date('2024-01-11T05:15:55.934Z'),
    batteryPercentage: 1609
  },
  {
    temperature: 21.6561,
    humidity: 34.7157,
    pressure: 99855.7109,
    gasResistance: 104881.4766,
    sensorId: 1,
    createdAt: new Date('2024-01-11T05:25:23.265Z'),
    batteryPercentage: 1609
  },
  {
    temperature: 21.6382,
    humidity: 34.9829,
    pressure: 99844.5469,
    gasResistance: 105539.8594,
    sensorId: 1,
    createdAt: new Date('2024-01-11T05:34:54.171Z'),
    batteryPercentage: 1609
  },
  {
    temperature: 21.6203,
    humidity: 34.9644,
    pressure: 99836.1328,
    gasResistance: 105872.1641,
    sensorId: 1,
    createdAt: new Date('2024-01-11T05:44:24.559Z'),
    batteryPercentage: 1607
  },
  {
    temperature: 21.6152,
    humidity: 35.02,
    pressure: 99838.0391,
    gasResistance: 106543.0938,
    sensorId: 1,
    createdAt: new Date('2024-01-11T05:53:55.738Z'),
    batteryPercentage: 1608
  },
  {
    temperature: 21.6331,
    humidity: 35.0553,
    pressure: 99810.8984,
    gasResistance: 106813.8594,
    sensorId: 1,
    createdAt: new Date('2024-01-11T06:03:25.1Z'),
    batteryPercentage: 1608
  },
  {
    temperature: 21.6357,
    humidity: 35.179,
    pressure: 99786.6953,
    gasResistance: 108118.9688,
    sensorId: 1,
    createdAt: new Date('2024-01-11T06:12:55.05Z'),
    batteryPercentage: 1608
  },
  {
    temperature: 21.6306,
    humidity: 35.3301,
    pressure: 99772.1797,
    gasResistance: 106813.8594,
    sensorId: 1,
    createdAt: new Date('2024-01-11T06:22:28.242Z'),
    batteryPercentage: 1608
  },
  {
    temperature: 21.6229,
    humidity: 35.2171,
    pressure: 99751.7656,
    gasResistance: 106005.6719,
    sensorId: 1,
    createdAt: new Date('2024-01-11T06:31:57.673Z'),
    batteryPercentage: 1553
  },
  {
    temperature: 21.5974,
    humidity: 34.6264,
    pressure: 99747.5547,
    gasResistance: 106475.6172,
    sensorId: 1,
    createdAt: new Date('2024-01-11T06:41:26.899Z'),
    batteryPercentage: 1607
  },
  {
    temperature: 21.577,
    humidity: 34.3954,
    pressure: 99749.6641,
    gasResistance: 107085.9844,
    sensorId: 1,
    createdAt: new Date('2024-01-11T06:50:56.75Z'),
    batteryPercentage: 1607
  },
  {
    temperature: 21.531,
    humidity: 34.6314,
    pressure: 99750.2969,
    gasResistance: 107910.7891,
    sensorId: 1,
    createdAt: new Date('2024-01-11T07:00:26.552Z'),
    batteryPercentage: 1609
  },
  {
    temperature: 21.531,
    humidity: 34.6761,
    pressure: 99744.8281,
    gasResistance: 103207.4922,
    sensorId: 1,
    createdAt: new Date('2024-01-11T07:01:00.455Z'),
    batteryPercentage: 1607
  },
  {
    temperature: 21.5336,
    humidity: 34.9507,
    pressure: 99715.1641,
    gasResistance: 105012.5,
    sensorId: 1,
    createdAt: new Date('2024-01-11T07:09:57.905Z'),
    batteryPercentage: 1608
  },
  {
    temperature: 21.5183,
    humidity: 34.8036,
    pressure: 99704.4453,
    gasResistance: 106005.6719,
    sensorId: 1,
    createdAt: new Date('2024-01-11T07:19:27.874Z'),
    batteryPercentage: 1608
  },
  {
    temperature: 21.4826,
    humidity: 34.9571,
    pressure: 99704.0234,
    gasResistance: 106340.9297,
    sensorId: 1,
    createdAt: new Date('2024-01-11T07:28:57.625Z'),
    batteryPercentage: 1608
  },
  {
    temperature: 21.4596,
    humidity: 34.787,
    pressure: 99705.6875,
    gasResistance: 107085.9844,
    sensorId: 1,
    createdAt: new Date('2024-01-11T07:38:29.466Z'),
    batteryPercentage: 1609
  },
  {
    temperature: 21.4392,
    humidity: 34.9923,
    pressure: 99716,
    gasResistance: 106813.8594,
    sensorId: 1,
    createdAt: new Date('2024-01-11T07:47:58.368Z'),
    batteryPercentage: 1609
  },
  {
    temperature: 21.4264,
    humidity: 35.1649,
    pressure: 99689.2969,
    gasResistance: 105938.875,
    sensorId: 1,
    createdAt: new Date('2024-01-11T07:57:28.635Z'),
    batteryPercentage: 1610
  },
  {
    temperature: 21.4009,
    humidity: 34.3345,
    pressure: 99712.4297,
    gasResistance: 106206.5703,
    sensorId: 1,
    createdAt: new Date('2024-01-11T08:06:59.118Z'),
    batteryPercentage: 1609
  },
  {
    temperature: 21.3984,
    humidity: 34.1224,
    pressure: 99706.5391,
    gasResistance: 107085.9844,
    sensorId: 1,
    createdAt: new Date('2024-01-11T08:16:29.338Z'),
    batteryPercentage: 1609
  },
  {
    temperature: 21.3856,
    humidity: 34.8136,
    pressure: 99726.3125,
    gasResistance: 108188.5469,
    sensorId: 1,
    createdAt: new Date('2024-01-11T08:26:00.665Z'),
    batteryPercentage: 1609
  },
  {
    temperature: 21.3754,
    humidity: 34.8575,
    pressure: 99710.9609,
    gasResistance: 108537.7734,
    sensorId: 1,
    createdAt: new Date('2024-01-11T08:35:29.974Z'),
    batteryPercentage: 1608
  },
  {
    temperature: 21.355,
    humidity: 33.9347,
    pressure: 99682.9844,
    gasResistance: 107222.5703,
    sensorId: 1,
    createdAt: new Date('2024-01-11T08:45:01.851Z'),
    batteryPercentage: 1607
  },
  {
    temperature: 21.4009,
    humidity: 34.4964,
    pressure: 99712.4297,
    gasResistance: 101158.2422,
    sensorId: 1,
    createdAt: new Date('2024-01-11T08:54:31.199Z'),
    batteryPercentage: 1608
  },
  {
    temperature: 21.3907,
    humidity: 34.066,
    pressure: 99738.0781,
    gasResistance: 99423.4141,
    sensorId: 1,
    createdAt: new Date('2024-01-11T09:04:00.997Z'),
    batteryPercentage: 1608
  },
  {
    temperature: 21.3754,
    humidity: 33.3813,
    pressure: 99743.7812,
    gasResistance: 100253.4297,
    sensorId: 1,
    createdAt: new Date('2024-01-11T09:13:32.877Z'),
    batteryPercentage: 1609
  },
  {
    temperature: 21.3881,
    humidity: 33.1,
    pressure: 99745.875,
    gasResistance: 95471.3125,
    sensorId: 1,
    createdAt: new Date('2024-01-11T09:13:50.659Z'),
    batteryPercentage: 1609
  },
  {
    temperature: 21.3448,
    humidity: 32.737,
    pressure: 99725.0469,
    gasResistance: 99364.6641,
    sensorId: 1,
    createdAt: new Date('2024-01-11T09:23:02.692Z'),
    batteryPercentage: 1609
  },
  {
    temperature: 21.3524,
    humidity: 32.5777,
    pressure: 99715.3672,
    gasResistance: 94611.7031,
    sensorId: 1,
    createdAt: new Date('2024-01-11T09:23:19.958Z'),
    batteryPercentage: 1554
  },
  {
    temperature: 21.3269,
    humidity: 31.6854,
    pressure: 99686.5547,
    gasResistance: 101097.4141,
    sensorId: 1,
    createdAt: new Date('2024-01-11T09:32:31.999Z'),
    batteryPercentage: 1609
  },
  {
    temperature: 21.3269,
    humidity: 31.8169,
    pressure: 99683.8203,
    gasResistance: 96126.3594,
    sensorId: 1,
    createdAt: new Date('2024-01-11T09:32:50.33Z'),
    batteryPercentage: 1609
  },
  {
    temperature: 21.3244,
    humidity: 31.7673,
    pressure: 99683.4062,
    gasResistance: 102765.8984,
    sensorId: 1,
    createdAt: new Date('2024-01-11T09:42:02.355Z'),
    batteryPercentage: 1609
  },
  {
    temperature: 21.3397,
    humidity: 32.4279,
    pressure: 99680.4688,
    gasResistance: 106610.6562,
    sensorId: 1,
    createdAt: new Date('2024-01-11T09:51:32.719Z'),
    batteryPercentage: 1609
  },
  {
    temperature: 21.3014,
    humidity: 31.333,
    pressure: 99715.1641,
    gasResistance: 110318.25,
    sensorId: 1,
    createdAt: new Date('2024-01-11T10:01:03.501Z'),
    batteryPercentage: 1609
  },
  {
    temperature: 21.2529,
    humidity: 31.2688,
    pressure: 99704.4219,
    gasResistance: 113751.6875,
    sensorId: 1,
    createdAt: new Date('2024-01-11T10:10:33.31Z'),
    batteryPercentage: 1608
  },
  {
    temperature: 21.2299,
    humidity: 32.9256,
    pressure: 99681.5156,
    gasResistance: 114996.5781,
    sensorId: 1,
    createdAt: new Date('2024-01-11T10:20:04.712Z'),
    batteryPercentage: 1608
  },
  {
    temperature: 21.2274,
    humidity: 34.2182,
    pressure: 99700.2266,
    gasResistance: 117078.6875,
    sensorId: 1,
    createdAt: new Date('2024-01-11T10:29:34.627Z'),
    batteryPercentage: 1554
  },
  {
    temperature: 21.2146,
    humidity: 32.4499,
    pressure: 99695.3828,
    gasResistance: 120692.7578,
    sensorId: 1,
    createdAt: new Date('2024-01-11T10:39:03.015Z'),
    batteryPercentage: 1554
  },
  {
    temperature: 21.1713,
    humidity: 32.2426,
    pressure: 99680.0391,
    gasResistance: 123349.2344,
    sensorId: 1,
    createdAt: new Date('2024-01-11T10:48:43.512Z'),
    batteryPercentage: 1608
  },
  {
    temperature: 21.2019,
    humidity: 32.2507,
    pressure: 99657.75,
    gasResistance: 125000,
    sensorId: 1,
    createdAt: new Date('2024-01-11T10:58:15.362Z'),
    batteryPercentage: 1608
  },
  {
    temperature: 21.2172,
    humidity: 32.1257,
    pressure: 99654.7969,
    gasResistance: 126030.7344,
    sensorId: 1,
    createdAt: new Date('2024-01-11T11:07:36.83Z'),
    batteryPercentage: 1608
  },
  {
    temperature: 21.2146,
    humidity: 31.9059,
    pressure: 99662.5859,
    gasResistance: 126886.7969,
    sensorId: 1,
    createdAt: new Date('2024-01-11T11:17:06.318Z'),
    batteryPercentage: 1608
  },
  {
    temperature: 21.2172,
    humidity: 31.8951,
    pressure: 99652.0703,
    gasResistance: 127078.6172,
    sensorId: 1,
    createdAt: new Date('2024-01-11T11:26:36.002Z'),
    batteryPercentage: 1608
  },
  {
    temperature: 21.1968,
    humidity: 33.7869,
    pressure: 99651.4375,
    gasResistance: 127078.6172,
    sensorId: 1,
    createdAt: new Date('2024-01-11T11:36:15.137Z'),
    batteryPercentage: 1607
  },
  {
    temperature: 21.184,
    humidity: 36.0138,
    pressure: 99652.0781,
    gasResistance: 123258.7969,
    sensorId: 1,
    createdAt: new Date('2024-01-11T11:45:36.621Z'),
    batteryPercentage: 1607
  },
  {
    temperature: 21.1585,
    humidity: 35.9945,
    pressure: 99634.1953,
    gasResistance: 118984.4375,
    sensorId: 1,
    createdAt: new Date('2024-01-11T11:55:09.946Z'),
    batteryPercentage: 1607
  },
  {
    temperature: 21.1483,
    humidity: 35.3801,
    pressure: 99637.9922,
    gasResistance: 115788.5781,
    sensorId: 1,
    createdAt: new Date('2024-01-11T12:04:37.265Z'),
    batteryPercentage: 1607
  },
  {
    temperature: 21.1304,
    humidity: 35.1876,
    pressure: 99615.9141,
    gasResistance: 112835.5703,
    sensorId: 1,
    createdAt: new Date('2024-01-11T12:14:08.101Z'),
    batteryPercentage: 1607
  },
  {
    temperature: 21.0947,
    humidity: 34.6859,
    pressure: 99607.2969,
    gasResistance: 110173.6562,
    sensorId: 1,
    createdAt: new Date('2024-01-11T12:23:40.113Z'),
    batteryPercentage: 1607
  },
  {
    temperature: 21.0998,
    humidity: 34.7088,
    pressure: 99602.6641,
    gasResistance: 104490.3672,
    sensorId: 1,
    createdAt: new Date('2024-01-11T12:23:57.42Z'),
    batteryPercentage: 1550
  },
  {
    temperature: 21.0871,
    humidity: 34.7803,
    pressure: 99584.1641,
    gasResistance: 104360.6484,
    sensorId: 1,
    createdAt: new Date('2024-01-11T12:33:26.063Z'),
    batteryPercentage: 1591
  },
  {
    temperature: 21.0717,
    humidity: 34.7453,
    pressure: 99570.7109,
    gasResistance: 103334.3516,
    sensorId: 1,
    createdAt: new Date('2024-01-11T12:42:40.035Z'),
    batteryPercentage: 1605
  },
  {
    temperature: 20.9875,
    humidity: 33.1361,
    pressure: 99554.1172,
    gasResistance: 103461.5391,
    sensorId: 1,
    createdAt: new Date('2024-01-11T12:52:08.833Z'),
    batteryPercentage: 1600
  },
  {
    temperature: 20.7783,
    humidity: 33.3277,
    pressure: 99557.8828,
    gasResistance: 108537.7734,
    sensorId: 1,
    createdAt: new Date('2024-01-11T13:01:50.219Z'),
    batteryPercentage: 1606
  },
  {
    temperature: 20.7502,
    humidity: 33.9798,
    pressure: 99561.4531,
    gasResistance: 111859.6094,
    sensorId: 1,
    createdAt: new Date('2024-01-11T13:11:09.519Z'),
    batteryPercentage: 1608
  },
  {
    temperature: 20.8115,
    humidity: 33.9853,
    pressure: 99557.8828,
    gasResistance: 109101.2344,
    sensorId: 1,
    createdAt: new Date('2024-01-11T13:20:39.875Z'),
    batteryPercentage: 1609
  },
  {
    temperature: 20.8446,
    humidity: 34.4953,
    pressure: 99574.2891,
    gasResistance: 107772.4375,
    sensorId: 1,
    createdAt: new Date('2024-01-11T13:30:10.256Z'),
    batteryPercentage: 1609
  },
  {
    temperature: 20.8651,
    humidity: 34.4525,
    pressure: 99574.9141,
    gasResistance: 107154.2344,
    sensorId: 1,
    createdAt: new Date('2024-01-11T13:39:43.079Z'),
    batteryPercentage: 1609
  },
  {
    temperature: 20.8676,
    humidity: 34.2353,
    pressure: 99558.9531,
    gasResistance: 106005.6719,
    sensorId: 1,
    createdAt: new Date('2024-01-11T13:49:12.218Z'),
    batteryPercentage: 1609
  },
  {
    temperature: 20.8651,
    humidity: 34.2017,
    pressure: 99561.2578,
    gasResistance: 100433.0859,
    sensorId: 1,
    createdAt: new Date('2024-01-11T13:49:29.515Z'),
    batteryPercentage: 1554
  },
  {
    temperature: 20.8778,
    humidity: 34.2419,
    pressure: 99566.1016,
    gasResistance: 102328.0625,
    sensorId: 1,
    createdAt: new Date('2024-01-11T13:58:41.021Z'),
    batteryPercentage: 1609
  },
  {
    temperature: 20.8804,
    humidity: 34.1808,
    pressure: 99566.5078,
    gasResistance: 103397.9062,
    sensorId: 1,
    createdAt: new Date('2024-01-11T14:08:12.814Z'),
    batteryPercentage: 1554
  },
  {
    temperature: 20.8778,
    humidity: 34.292,
    pressure: 99579.7578,
    gasResistance: 105143.8359,
    sensorId: 1,
    createdAt: new Date('2024-01-11T14:17:41.7Z'),
    batteryPercentage: 1609
  },
  {
    temperature: 20.8064,
    humidity: 33.574,
    pressure: 99581.6328,
    gasResistance: 104102.1719,
    sensorId: 1,
    createdAt: new Date('2024-01-11T14:27:13.496Z'),
    batteryPercentage: 1609
  },
  {
    temperature: 20.7171,
    humidity: 32.8967,
    pressure: 99605.1484,
    gasResistance: 102141.5547,
    sensorId: 1,
    createdAt: new Date('2024-01-11T14:36:42.446Z'),
    batteryPercentage: 1609
  },
  {
    temperature: 20.6482,
    humidity: 32.3289,
    pressure: 99607.4531,
    gasResistance: 100613.4062,
    sensorId: 1,
    createdAt: new Date('2024-01-11T14:46:13.608Z'),
    batteryPercentage: 1608
  },
  {
    temperature: 20.5512,
    humidity: 31.7227,
    pressure: 99607.8594,
    gasResistance: 100493.125,
    sensorId: 1,
    createdAt: new Date('2024-01-11T14:55:42.993Z'),
    batteryPercentage: 1608
  },
  {
    temperature: 20.5589,
    humidity: 31.7781,
    pressure: 99617.3203,
    gasResistance: 100673.6562,
    sensorId: 1,
    createdAt: new Date('2024-01-11T15:05:13.774Z'),
    batteryPercentage: 1608
  },
  {
    temperature: 20.5844,
    humidity: 31.7858,
    pressure: 99626.9844,
    gasResistance: 101524.7578,
    sensorId: 1,
    createdAt: new Date('2024-01-11T15:14:45.059Z'),
    batteryPercentage: 1607
  },
  {
    temperature: 20.6175,
    humidity: 31.5698,
    pressure: 99610.6016,
    gasResistance: 103397.9062,
    sensorId: 1,
    createdAt: new Date('2024-01-11T15:24:14.498Z'),
    batteryPercentage: 1607
  },
  {
    temperature: 20.6584,
    humidity: 29.8777,
    pressure: 99614.5938,
    gasResistance: 107703.3906,
    sensorId: 1,
    createdAt: new Date('2024-01-11T15:33:53.06Z'),
    batteryPercentage: 1608
  },
  {
    temperature: 20.8395,
    humidity: 30.0601,
    pressure: 99614.4141,
    gasResistance: 112307.9531,
    sensorId: 1,
    createdAt: new Date('2024-01-11T15:43:14.513Z'),
    batteryPercentage: 1608
  },
  {
    temperature: 20.8421,
    humidity: 30.0333,
    pressure: 99617.5703,
    gasResistance: 105739,
    sensorId: 1,
    createdAt: new Date('2024-01-11T15:43:31.812Z'),
    batteryPercentage: 1553
  },
  {
    temperature: 20.9518,
    humidity: 29.9287,
    pressure: 99605.5938,
    gasResistance: 113063.2188,
    sensorId: 1,
    createdAt: new Date('2024-01-11T15:52:46.339Z'),
    batteryPercentage: 1607
  },
  {
    temperature: 20.985,
    humidity: 30.1858,
    pressure: 99613.7891,
    gasResistance: 116430.0625,
    sensorId: 1,
    createdAt: new Date('2024-01-11T16:02:15.783Z'),
    batteryPercentage: 1608
  },
  {
    temperature: 20.9773,
    humidity: 31.9073,
    pressure: 99612.5391,
    gasResistance: 117734.5938,
    sensorId: 1,
    createdAt: new Date('2024-01-11T16:11:46.981Z'),
    batteryPercentage: 1608
  },
  {
    temperature: 20.9493,
    humidity: 31.6036,
    pressure: 99635.2266,
    gasResistance: 117734.5938,
    sensorId: 1,
    createdAt: new Date('2024-01-11T16:21:15.766Z'),
    batteryPercentage: 1553
  },
  {
    temperature: 20.9926,
    humidity: 30.8271,
    pressure: 99636.9219,
    gasResistance: 120866.2812,
    sensorId: 1,
    createdAt: new Date('2024-01-11T16:30:46.304Z'),
    batteryPercentage: 1607
  },
  {
    temperature: 21.0539,
    humidity: 31.0828,
    pressure: 99641.5547,
    gasResistance: 122272.7344,
    sensorId: 1,
    createdAt: new Date('2024-01-11T16:40:17.083Z'),
    batteryPercentage: 1608
  },
  {
    temperature: 21.1866,
    humidity: 31.2304,
    pressure: 99641.5547,
    gasResistance: 123803.3984,
    sensorId: 1,
    createdAt: new Date('2024-01-11T16:49:48.257Z'),
    batteryPercentage: 1608
  },
  {
    temperature: 21.2759,
    humidity: 31.0798,
    pressure: 99637.1406,
    gasResistance: 124814.3984,
    sensorId: 1,
    createdAt: new Date('2024-01-11T16:59:18.085Z'),
    batteryPercentage: 1607
  },
  {
    temperature: 21.3626,
    humidity: 30.6895,
    pressure: 99626.8359,
    gasResistance: 126314.8047,
    sensorId: 1,
    createdAt: new Date('2024-01-11T17:08:47.548Z'),
    batteryPercentage: 1607
  },
  {
    temperature: 21.4239,
    humidity: 30.6457,
    pressure: 99634.1953,
    gasResistance: 127851.7031,
    sensorId: 1,
    createdAt: new Date('2024-01-11T17:18:17.764Z'),
    batteryPercentage: 1607
  },
  {
    temperature: 21.4928,
    humidity: 30.8311,
    pressure: 99631.8672,
    gasResistance: 129227.5156,
    sensorId: 1,
    createdAt: new Date('2024-01-11T17:27:49.629Z'),
    batteryPercentage: 1606
  },
  {
    temperature: 21.5948,
    humidity: 31.2652,
    pressure: 99640.4844,
    gasResistance: 129726.0859,
    sensorId: 1,
    createdAt: new Date('2024-01-11T17:37:19.086Z'),
    batteryPercentage: 1606
  },
  {
    temperature: 21.6459,
    humidity: 31.2368,
    pressure: 99640.6875,
    gasResistance: 127657.5469,
    sensorId: 1,
    createdAt: new Date('2024-01-11T17:46:58.142Z'),
    batteryPercentage: 1604
  },
  {
    temperature: 21.7097,
    humidity: 32.3117,
    pressure: 99645.7188,
    gasResistance: 122808.625,
    sensorId: 1,
    createdAt: new Date('2024-01-11T17:56:19.672Z'),
    batteryPercentage: 1607
  },
  {
    temperature: 21.7479,
    humidity: 32.1005,
    pressure: 99654.75,
    gasResistance: 118648.5547,
    sensorId: 1,
    createdAt: new Date('2024-01-11T18:05:49.606Z'),
    batteryPercentage: 1606
  },
  {
    temperature: 21.8526,
    humidity: 32.6551,
    pressure: 99641.8906,
    gasResistance: 115868.3594,
    sensorId: 1,
    createdAt: new Date('2024-01-11T18:15:20.775Z'),
    batteryPercentage: 1606
  },
  {
    temperature: 21.8704,
    humidity: 37.0373,
    pressure: 99644.8359,
    gasResistance: 115233.0312,
    sensorId: 1,
    createdAt: new Date('2024-01-11T18:24:50.108Z'),
    batteryPercentage: 1607
  },
  {
    temperature: 21.901,
    humidity: 34.046,
    pressure: 99641.6641,
    gasResistance: 114682.8047,
    sensorId: 1,
    createdAt: new Date('2024-01-11T18:34:21.905Z'),
    batteryPercentage: 1608
  },
  {
    temperature: 21.9929,
    humidity: 33.7315,
    pressure: 99651.3125,
    gasResistance: 114682.8047,
    sensorId: 1,
    createdAt: new Date('2024-01-11T18:43:51.817Z'),
    batteryPercentage: 1607
  },
  {
    temperature: 22.0899,
    humidity: 33.6736,
    pressure: 99645.3906,
    gasResistance: 114839.4766,
    sensorId: 1,
    createdAt: new Date('2024-01-11T18:53:21.081Z'),
    batteryPercentage: 1551
  },
  {
    temperature: 22.1664,
    humidity: 33.5472,
    pressure: 99636.1016,
    gasResistance: 115391.2109,
    sensorId: 1,
    createdAt: new Date('2024-01-11T19:02:51.449Z'),
    batteryPercentage: 1607
  },
  {
    temperature: 22.1715,
    humidity: 33.5199,
    pressure: 99631.4609,
    gasResistance: 109243.0156,
    sensorId: 1,
    createdAt: new Date('2024-01-11T19:03:09.757Z'),
    batteryPercentage: 1606
  },
  {
    temperature: 22.2914,
    humidity: 34.0819,
    pressure: 99640.25,
    gasResistance: 112158.1094,
    sensorId: 1,
    createdAt: new Date('2024-01-11T19:12:22.763Z'),
    batteryPercentage: 1605
  },
  {
    temperature: 22.3654,
    humidity: 34.8718,
    pressure: 99641.4688,
    gasResistance: 113139.2891,
    sensorId: 1,
    createdAt: new Date('2024-01-11T19:21:52.161Z'),
    batteryPercentage: 1604
  },
  {
    temperature: 22.4369,
    humidity: 34.4752,
    pressure: 99634.0703,
    gasResistance: 114215.3594,
    sensorId: 1,
    createdAt: new Date('2024-01-11T19:31:32.342Z'),
    batteryPercentage: 1603
  },
  {
    temperature: 22.4981,
    humidity: 34.2853,
    pressure: 99641.4141,
    gasResistance: 114996.5781,
    sensorId: 1,
    createdAt: new Date('2024-01-11T19:40:54.328Z'),
    batteryPercentage: 1606
  },
  {
    temperature: 22.5721,
    humidity: 34.0632,
    pressure: 99656.3281,
    gasResistance: 116510.7422,
    sensorId: 1,
    createdAt: new Date('2024-01-11T19:50:23.665Z'),
    batteryPercentage: 1606
  },
  {
    temperature: 22.613,
    humidity: 34.0056,
    pressure: 99665.7969,
    gasResistance: 117078.6875,
    sensorId: 1,
    createdAt: new Date('2024-01-11T19:59:53.54Z'),
    batteryPercentage: 1606
  },
  {
    temperature: 22.5058,
    humidity: 33.6115,
    pressure: 99672.8047,
    gasResistance: 118397.8906,
    sensorId: 1,
    createdAt: new Date('2024-01-11T20:09:35.907Z'),
    batteryPercentage: 1603
  },
  {
    temperature: 22.419,
    humidity: 33.2204,
    pressure: 99666.7422,
    gasResistance: 118816.2578,
    sensorId: 1,
    createdAt: new Date('2024-01-11T20:18:55.191Z'),
    batteryPercentage: 1605
  },
  {
    temperature: 22.3323,
    humidity: 32.742,
    pressure: 99677.0938,
    gasResistance: 120347.1719,
    sensorId: 1,
    createdAt: new Date('2024-01-11T20:28:34.856Z'),
    batteryPercentage: 1606
  },
  {
    temperature: 22.2659,
    humidity: 32.3663,
    pressure: 99690.8125,
    gasResistance: 121389.9062,
    sensorId: 1,
    createdAt: new Date('2024-01-11T20:37:54.87Z'),
    batteryPercentage: 1605
  },
  {
    temperature: 22.2481,
    humidity: 33.5602,
    pressure: 99687.8672,
    gasResistance: 121829.7031,
    sensorId: 1,
    createdAt: new Date('2024-01-11T20:47:26.194Z'),
    batteryPercentage: 1606
  },
  {
    temperature: 22.2685,
    humidity: 33.5509,
    pressure: 99693.9688,
    gasResistance: 116028.2969,
    sensorId: 1,
    createdAt: new Date('2024-01-11T20:47:52.921Z'),
    batteryPercentage: 1606
  },
  {
    temperature: 22.2506,
    humidity: 33.566,
    pressure: 99704.7109,
    gasResistance: 119832.5,
    sensorId: 1,
    createdAt: new Date('2024-01-11T20:57:05.941Z'),
    batteryPercentage: 1606
  },
  {
    temperature: 22.22,
    humidity: 33.4799,
    pressure: 99705.1406,
    gasResistance: 121127.5234,
    sensorId: 1,
    createdAt: new Date('2024-01-11T21:06:26.04Z'),
    batteryPercentage: 1606
  },
  {
    temperature: 22.1766,
    humidity: 33.3871,
    pressure: 99703.4766,
    gasResistance: 121741.4844,
    sensorId: 1,
    createdAt: new Date('2024-01-11T21:15:56.421Z'),
    batteryPercentage: 1605
  },
  {
    temperature: 22.1358,
    humidity: 33.4666,
    pressure: 99710.4375,
    gasResistance: 122808.625,
    sensorId: 1,
    createdAt: new Date('2024-01-11T21:25:27.567Z'),
    batteryPercentage: 1606
  },
  {
    temperature: 22.1026,
    humidity: 33.336,
    pressure: 99710.4531,
    gasResistance: 123349.2344,
    sensorId: 1,
    createdAt: new Date('2024-01-11T21:34:56.953Z'),
    batteryPercentage: 1607
  },
  {
    temperature: 22.0694,
    humidity: 33.8776,
    pressure: 99715.9297,
    gasResistance: 123439.7969,
    sensorId: 1,
    createdAt: new Date('2024-01-11T21:44:37.173Z'),
    batteryPercentage: 1605
  },
  {
    temperature: 22.0822,
    humidity: 33.6173,
    pressure: 99726.25,
    gasResistance: 123439.7969,
    sensorId: 1,
    createdAt: new Date('2024-01-11T21:53:58.121Z'),
    batteryPercentage: 1605
  },
  {
    temperature: 22.0694,
    humidity: 33.8553,
    pressure: 99718.6562,
    gasResistance: 123803.3984,
    sensorId: 1,
    createdAt: new Date('2024-01-11T22:03:28.474Z'),
    batteryPercentage: 1606
  },
  {
    temperature: 22.0797,
    humidity: 33.8507,
    pressure: 99725.8359,
    gasResistance: 123530.5,
    sensorId: 1,
    createdAt: new Date('2024-01-11T22:12:58.43Z'),
    batteryPercentage: 1607
  },
  {
    temperature: 22.072,
    humidity: 33.7999,
    pressure: 99738.25,
    gasResistance: 123985.9766,
    sensorId: 1,
    createdAt: new Date('2024-01-11T22:22:28.81Z'),
    batteryPercentage: 1606
  },
  {
    temperature: 22.0669,
    humidity: 33.716,
    pressure: 99764.7812,
    gasResistance: 124260.8984,
    sensorId: 1,
    createdAt: new Date('2024-01-11T22:31:59.584Z'),
    batteryPercentage: 1549
  },
  {
    temperature: 22.0669,
    humidity: 33.627,
    pressure: 99753.8281,
    gasResistance: 124169.125,
    sensorId: 1,
    createdAt: new Date('2024-01-11T22:41:29.298Z'),
    batteryPercentage: 1604
  },
  {
    temperature: 22.0797,
    humidity: 34.0568,
    pressure: 99747.7266,
    gasResistance: 124260.8984,
    sensorId: 1,
    createdAt: new Date('2024-01-11T22:51:02.172Z'),
    batteryPercentage: 1604
  },
  {
    temperature: 22.095,
    humidity: 33.8744,
    pressure: 99763.9453,
    gasResistance: 124444.8594,
    sensorId: 1,
    createdAt: new Date('2024-01-11T23:00:30.704Z'),
    batteryPercentage: 1605
  },
  {
    temperature: 22.1026,
    humidity: 33.8918,
    pressure: 99754.2422,
    gasResistance: 124907.1328,
    sensorId: 1,
    createdAt: new Date('2024-01-11T23:10:10.297Z'),
    batteryPercentage: 1587
  },
  {
    temperature: 22.1205,
    humidity: 33.9826,
    pressure: 99762.6641,
    gasResistance: 124629.3438,
    sensorId: 1,
    createdAt: new Date('2024-01-11T23:19:40.007Z'),
    batteryPercentage: 1604
  },
  {
    temperature: 22.1511,
    humidity: 34.1917,
    pressure: 99767.6953,
    gasResistance: 124721.8047,
    sensorId: 1,
    createdAt: new Date('2024-01-11T23:29:01.033Z'),
    batteryPercentage: 1604
  },
  {
    temperature: 22.1792,
    humidity: 35.0899,
    pressure: 99766.8672,
    gasResistance: 123803.3984,
    sensorId: 1,
    createdAt: new Date('2024-01-11T23:38:31.348Z'),
    batteryPercentage: 1606
  },
  {
    temperature: 22.1562,
    humidity: 34.9979,
    pressure: 99782.2422,
    gasResistance: 123439.7969,
    sensorId: 1,
    createdAt: new Date('2024-01-11T23:48:05.195Z'),
    batteryPercentage: 1604
  },
  {
    temperature: 22.1256,
    humidity: 34.0722,
    pressure: 99790.8672,
    gasResistance: 122988.3047,
    sensorId: 1,
    createdAt: new Date('2024-01-11T23:57:33.016Z'),
    batteryPercentage: 1606
  },
  {
    temperature: 22.1281,
    humidity: 34.4912,
    pressure: 99810.4531,
    gasResistance: 122988.3047,
    sensorId: 1,
    createdAt: new Date('2024-01-12T00:07:02.883Z'),
    batteryPercentage: 1606
  },
  {
    temperature: 22.1332,
    humidity: 34.4861,
    pressure: 99803.0859,
    gasResistance: 116028.2969,
    sensorId: 1,
    createdAt: new Date('2024-01-12T00:07:20.252Z'),
    batteryPercentage: 1605
  },
  {
    temperature: 22.1639,
    humidity: 34.4107,
    pressure: 99799.9297,
    gasResistance: 118984.4375,
    sensorId: 1,
    createdAt: new Date('2024-01-12T00:16:32.705Z'),
    batteryPercentage: 1604
  },
  {
    temperature: 22.1868,
    humidity: 35.3547,
    pressure: 99798.2266,
    gasResistance: 119832.5,
    sensorId: 1,
    createdAt: new Date('2024-01-12T00:26:03.056Z'),
    batteryPercentage: 1604
  },
  {
    temperature: 22.2276,
    humidity: 35.8544,
    pressure: 99794.0078,
    gasResistance: 119747.1484,
    sensorId: 1,
    createdAt: new Date('2024-01-12T00:35:34.423Z'),
    batteryPercentage: 1605
  },
  {
    temperature: 22.2557,
    humidity: 36.1396,
    pressure: 99787.6797,
    gasResistance: 119661.9219,
    sensorId: 1,
    createdAt: new Date('2024-01-12T00:45:04.376Z'),
    batteryPercentage: 1605
  },
  {
    temperature: 22.2761,
    humidity: 36.85,
    pressure: 99791.0391,
    gasResistance: 118900.2891,
    sensorId: 1,
    createdAt: new Date('2024-01-12T00:54:34.617Z'),
    batteryPercentage: 1604
  },
  {
    temperature: 22.3016,
    humidity: 36.8298,
    pressure: 99781.5781,
    gasResistance: 118397.8906,
    sensorId: 1,
    createdAt: new Date('2024-01-12T01:04:05.97Z'),
    batteryPercentage: 1604
  },
  {
    temperature: 22.3016,
    humidity: 37.0799,
    pressure: 99792.5234,
    gasResistance: 117405.7188,
    sensorId: 1,
    createdAt: new Date('2024-01-12T01:13:34.92Z'),
    batteryPercentage: 1604
  },
  {
    temperature: 22.3042,
    humidity: 37.3364,
    pressure: 99782.0078,
    gasResistance: 116430.0625,
    sensorId: 1,
    createdAt: new Date('2024-01-12T01:23:05.289Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 22.2812,
    humidity: 37.3398,
    pressure: 99794.6406,
    gasResistance: 115708.8828,
    sensorId: 1,
    createdAt: new Date('2024-01-12T01:33:12.09Z'),
    batteryPercentage: 1600
  },
  {
    temperature: 22.3246,
    humidity: 37.2017,
    pressure: 99782.6172,
    gasResistance: 114761.0859,
    sensorId: 1,
    createdAt: new Date('2024-01-12T01:42:16.176Z'),
    batteryPercentage: 1600
  },
  {
    temperature: 22.3323,
    humidity: 38.5751,
    pressure: 99786.6172,
    gasResistance: 113983.0547,
    sensorId: 1,
    createdAt: new Date('2024-01-12T01:51:38.267Z'),
    batteryPercentage: 1600
  },
  {
    temperature: 22.2889,
    humidity: 38.2608,
    pressure: 99795.8906,
    gasResistance: 113215.4844,
    sensorId: 1,
    createdAt: new Date('2024-01-12T02:01:07.491Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 22.2634,
    humidity: 37.9661,
    pressure: 99794.4297,
    gasResistance: 112008.6641,
    sensorId: 1,
    createdAt: new Date('2024-01-12T02:10:37.359Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 22.2532,
    humidity: 38.1712,
    pressure: 99795.4844,
    gasResistance: 111193.7734,
    sensorId: 1,
    createdAt: new Date('2024-01-12T02:20:25.549Z'),
    batteryPercentage: 1601
  },
  {
    temperature: 22.2404,
    humidity: 38.0726,
    pressure: 99798.8516,
    gasResistance: 110245.9062,
    sensorId: 1,
    createdAt: new Date('2024-01-12T02:29:39.504Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 22.271,
    humidity: 38.5976,
    pressure: 99812.1172,
    gasResistance: 110029.4453,
    sensorId: 1,
    createdAt: new Date('2024-01-12T02:39:08.915Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 22.2736,
    humidity: 38.7128,
    pressure: 99815.2734,
    gasResistance: 109456.375,
    sensorId: 1,
    createdAt: new Date('2024-01-12T02:48:38.835Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 22.243,
    humidity: 38.5258,
    pressure: 99802.0156,
    gasResistance: 109030.4766,
    sensorId: 1,
    createdAt: new Date('2024-01-12T02:58:09.481Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 22.2251,
    humidity: 38.4379,
    pressure: 99820.9688,
    gasResistance: 108959.8125,
    sensorId: 1,
    createdAt: new Date('2024-01-12T03:07:38.792Z'),
    batteryPercentage: 1603
  },
  {
    temperature: 22.2225,
    humidity: 38.2082,
    pressure: 99823.2969,
    gasResistance: 108537.7734,
    sensorId: 1,
    createdAt: new Date('2024-01-12T03:17:10.13Z'),
    batteryPercentage: 1603
  },
  {
    temperature: 22.2047,
    humidity: 38.3841,
    pressure: 99834.0312,
    gasResistance: 108537.7734,
    sensorId: 1,
    createdAt: new Date('2024-01-12T03:26:48.103Z'),
    batteryPercentage: 1604
  },
  {
    temperature: 22.2072,
    humidity: 38.8095,
    pressure: 99848.1328,
    gasResistance: 108188.5469,
    sensorId: 1,
    createdAt: new Date('2024-01-12T03:36:19.73Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 22.197,
    humidity: 39.1885,
    pressure: 99838.2578,
    gasResistance: 107565.5859,
    sensorId: 1,
    createdAt: new Date('2024-01-12T03:45:40.881Z'),
    batteryPercentage: 1603
  },
  {
    temperature: 22.197,
    humidity: 39.4482,
    pressure: 99838.2578,
    gasResistance: 106881.7578,
    sensorId: 1,
    createdAt: new Date('2024-01-12T03:55:11.023Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 22.1868,
    humidity: 39.3144,
    pressure: 99844.7656,
    gasResistance: 106273.7109,
    sensorId: 1,
    createdAt: new Date('2024-01-12T04:04:40.836Z'),
    batteryPercentage: 1603
  },
  {
    temperature: 22.1868,
    humidity: 39.1241,
    pressure: 99842.0234,
    gasResistance: 106206.5703,
    sensorId: 1,
    createdAt: new Date('2024-01-12T04:14:12.687Z'),
    batteryPercentage: 1603
  },
  {
    temperature: 22.1843,
    humidity: 39.1757,
    pressure: 99841.625,
    gasResistance: 105872.1641,
    sensorId: 1,
    createdAt: new Date('2024-01-12T04:23:42.487Z'),
    batteryPercentage: 1602
  },
  {
    temperature: 22.2149,
    humidity: 39.2596,
    pressure: 99841.1953,
    gasResistance: 105805.5312,
    sensorId: 1,
    createdAt: new Date('2024-01-12T04:33:40.163Z'),
    batteryPercentage: 1601
  },
  {
    temperature: 22.2225,
    humidity: 39.1566,
    pressure: 99847.9297,
    gasResistance: 105606.1562,
    sensorId: 1,
    createdAt: new Date('2024-01-12T04:42:51.163Z'),
    batteryPercentage: 1603
  },
  {
    temperature: 22.1996,
    humidity: 39.0159,
    pressure: 99846.8828,
    gasResistance: 103461.5391,
    sensorId: 1,
    createdAt: new Date('2024-01-12T04:52:13.683Z'),
    batteryPercentage: 1603
  },
  {
    temperature: 22.2123,
    humidity: 38.7582,
    pressure: 99857.1953,
    gasResistance: 99364.6641,
    sensorId: 1,
    createdAt: new Date('2024-01-12T05:01:44.805Z'),
    batteryPercentage: 1603
  },
  {
    temperature: 22.2149,
    humidity: 38.8333,
    pressure: 99863.0938,
    gasResistance: 97633.5625,
    sensorId: 1,
    createdAt: new Date('2024-01-12T05:11:31.423Z'),
    batteryPercentage: 1603
  },
  {
    temperature: 22.2174,
    humidity: 38.989,
    pressure: 99869,
    gasResistance: 95579.8672,
    sensorId: 1,
    createdAt: new Date('2024-01-12T05:20:52.329Z'),
    batteryPercentage: 1603
  },
  {
    temperature: 22.2047,
    humidity: 38.7805,
    pressure: 99883.3125,
    gasResistance: 93872.1406,
    sensorId: 1,
    createdAt: new Date('2024-01-12T05:30:13.774Z'),
    batteryPercentage: 1548
  },
  {
    temperature: 22.2072,
    humidity: 38.4074,
    pressure: 99894.6719,
    gasResistance: 93506.6797,
    sensorId: 1,
    createdAt: new Date('2024-01-12T05:39:45.635Z'),
    batteryPercentage: 1604
  },
  {
    temperature: 22.1817,
    humidity: 38.2385,
    pressure: 99909.6328,
    gasResistance: 94082.2578,
    sensorId: 1,
    createdAt: new Date('2024-01-12T05:49:15.507Z'),
    batteryPercentage: 1605
  },
  {
    temperature: 22.1562,
    humidity: 38.1156,
    pressure: 99919.1094,
    gasResistance: 94240.4688,
    sensorId: 1,
    createdAt: new Date('2024-01-12T05:58:44.823Z'),
    batteryPercentage: 1605
  },
  {
    temperature: 22.1792,
    humidity: 37.849,
    pressure: 99914.6953,
    gasResistance: 94718.3125,
    sensorId: 1,
    createdAt: new Date('2024-01-12T06:08:15.216Z'),
    batteryPercentage: 1605
  },
  {
    temperature: 22.1588,
    humidity: 37.687,
    pressure: 99925.0234,
    gasResistance: 95961.75,
    sensorId: 1,
    createdAt: new Date('2024-01-12T06:17:46.466Z'),
    batteryPercentage: 1604
  },
  {
    temperature: 22.146,
    humidity: 37.68,
    pressure: 99922.9062,
    gasResistance: 96734.7578,
    sensorId: 1,
    createdAt: new Date('2024-01-12T06:27:16.368Z'),
    batteryPercentage: 1604
  },
  {
    temperature: 22.1383,
    humidity: 38.0508,
    pressure: 99918.8984,
    gasResistance: 97407.3047,
    sensorId: 1,
    createdAt: new Date('2024-01-12T06:36:47.689Z'),
    batteryPercentage: 1604
  },
  {
    temperature: 22.1001,
    humidity: 37.6811,
    pressure: 99934.4844,
    gasResistance: 97350.8906,
    sensorId: 1,
    createdAt: new Date('2024-01-12T06:46:17.109Z'),
    batteryPercentage: 1604
  },
  {
    temperature: 22.0797,
    humidity: 37.839,
    pressure: 99933.8594,
    gasResistance: 97576.8984,
    sensorId: 1,
    createdAt: new Date('2024-01-12T06:55:57.156Z'),
    batteryPercentage: 1603
  },
  {
    temperature: 22.0592,
    humidity: 37.5629,
    pressure: 99925.0156,
    gasResistance: 95093.3281,
    sensorId: 1,
    createdAt: new Date('2024-01-12T07:05:17.858Z'),
    batteryPercentage: 1604
  },
  {
    temperature: 22.0439,
    humidity: 37.6184,
    pressure: 99922.4844,
    gasResistance: 93819.7578,
    sensorId: 1,
    createdAt: new Date('2024-01-12T07:14:48.015Z'),
    batteryPercentage: 1604
  },
  {
    temperature: 22.0057,
    humidity: 37.4834,
    pressure: 99921.6328,
    gasResistance: 91747.25,
    sensorId: 1,
    createdAt: new Date('2024-01-12T07:24:17.957Z'),
    batteryPercentage: 1604
  },
  {
    temperature: 21.9954,
    humidity: 37.3741,
    pressure: 99919.9531,
    gasResistance: 91447.8281,
    sensorId: 1,
    createdAt: new Date('2024-01-12T07:33:56.306Z'),
    batteryPercentage: 1604
  },
  {
    temperature: 21.9954,
    humidity: 37.3684,
    pressure: 99925.4219,
    gasResistance: 91747.25,
    sensorId: 1,
    createdAt: new Date('2024-01-12T07:43:18.467Z'),
    batteryPercentage: 1604
  },
  {
    temperature: 21.9852,
    humidity: 37.4928,
    pressure: 99912.7969,
    gasResistance: 91947.9609,
    sensorId: 1,
    createdAt: new Date('2024-01-12T07:52:49.809Z'),
    batteryPercentage: 1604
  },
  {
    temperature: 22.0108,
    humidity: 38.5366,
    pressure: 99919.7344,
    gasResistance: 90658.8359,
    sensorId: 1,
    createdAt: new Date('2024-01-12T08:02:19.122Z'),
    batteryPercentage: 1604
  },
  {
    temperature: 22.0133,
    humidity: 38.7034,
    pressure: 99917.4141,
    gasResistance: 92964.8203,
    sensorId: 1,
    createdAt: new Date('2024-01-12T08:02:45.432Z'),
    batteryPercentage: 1603
  },
  {
    temperature: 22.0184,
    humidity: 37.5816,
    pressure: 99910.0547,
    gasResistance: 90075.9688,
    sensorId: 1,
    createdAt: new Date('2024-01-12T08:11:50.414Z'),
    batteryPercentage: 1604
  },
  {
    temperature: 22.0771,
    humidity: 41.4052,
    pressure: 99917.0078,
    gasResistance: 90269.4297,
    sensorId: 1,
    createdAt: new Date('2024-01-12T08:21:28.769Z'),
    batteryPercentage: 1604
  },
  {
    temperature: 22.146,
    humidity: 39.3794,
    pressure: 99906.4844,
    gasResistance: 91547.4141,
    sensorId: 1,
    createdAt: new Date('2024-01-12T08:30:50.088Z'),
    batteryPercentage: 1604
  },
  {
    temperature: 22.1639,
    humidity: 38.0992,
    pressure: 99903.9531,
    gasResistance: 93899.3984,
    sensorId: 1,
    createdAt: new Date('2024-01-12T08:40:21.95Z'),
    batteryPercentage: 1604
  },
  {
    temperature: 22.1715,
    humidity: 37.2264,
    pressure: 99905.2109,
    gasResistance: 90366.4609,
    sensorId: 1,
    createdAt: new Date('2024-01-12T08:49:51.292Z'),
    batteryPercentage: 1605
  },
  {
    temperature: 22.1766,
    humidity: 36.8459,
    pressure: 99919.7422,
    gasResistance: 93819.7578,
    sensorId: 1,
    createdAt: new Date('2024-01-12T08:59:21.074Z'),
    batteryPercentage: 1606
  }
] satisfies (typeof bme68xDataSchema.$inferInsert)[];

const timeDifference = differenceInMilliseconds(
  new Date(),
  bme68xData[bme68xData.length - 1].createdAt
);

const transformedBme68xData = bme68xData.map((data) => ({
  ...data,
  createdAt: addMilliseconds(data.createdAt, timeDifference)
}));

console.log('Seed started');

const db = await drizzle('node-postgres', { connection: dbUrl, schema });

await db.insert(userSchema).values(hashedUserData).onConflictDoNothing();
await Promise.all([
  db.insert(sensorSchema).values(sensorData).onConflictDoNothing(),
  db.insert(kioskSchema).values(kioskData).onConflictDoNothing()
]);
await Promise.all([
  db.insert(kioskToSensorSchema).values(kioskToSensorData).onConflictDoNothing(),
  db.insert(bme68xDataSchema).values(transformedBme68xData).onConflictDoNothing()
]);

console.log('Seed completed');
