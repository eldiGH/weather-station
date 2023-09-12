import express, { json } from 'express';
import { corsMiddleware, errorHandlerMiddleware, notFoundMiddleware } from './middlewares';
import { router } from './router';

export const app: express.Express = express();

app.use(corsMiddleware);
app.use(json());
app.use(router);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
