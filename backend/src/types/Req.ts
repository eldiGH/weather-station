import type { Request } from 'express';

export type Req<ReqBody = never> = Request<unknown, unknown, ReqBody>;
