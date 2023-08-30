import type { Request } from 'express';

export type Req<Body = never, Params = never, Query = never> = Request<
  Params,
  unknown,
  Body,
  Query
>;
