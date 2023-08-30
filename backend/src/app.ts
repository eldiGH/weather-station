import express, { json } from 'express';
import { errorHandlerMiddleware, notFoundMiddleware } from './middlewares';
import { corsMiddleware } from './middlewares/corsMiddleware';
import { router } from './router';

export const app = express();

app.use(corsMiddleware);
app.use(json());
app.use(router);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
