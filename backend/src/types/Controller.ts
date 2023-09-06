import { User } from '@prisma/client';
import type { HttpMethods } from './HttpMethod';
import type { Req } from './Req';
import type { Res } from './Res';
import type { Schema } from 'yup';

export interface Controller {
  path: string;
  endpoints: Endpoint[];
}

export interface EndpointConfig<
  BodySchema extends Schema = never,
  ParamsSchema extends Schema = never,
  QuerySchema extends Schema = never
> {
  name: string;
  path: string;
  method: HttpMethods;
  bodyValidationSchema?: BodySchema;
  paramsValidationSchema?: ParamsSchema;
  queryValidationSchema?: QuerySchema;
}

export interface AuthEndpointConfig<
  BodySchema extends Schema = never,
  ParamsSchema extends Schema = never,
  QuerySchema extends Schema = never,
  Auth extends boolean = boolean
> extends EndpointConfig<BodySchema, ParamsSchema, QuerySchema> {
  auth: Auth;
}

export type EndpointCallback<
  Body = never,
  Params = never,
  Query = never,
  Auth extends boolean = boolean
> = (
  req: Req<Body, Params, Query>,
  res: Res<Auth extends true ? { user: User } : Record<string, unknown>>
) => Promise<void>;

export interface Endpoint extends AuthEndpointConfig {
  callback: EndpointCallback;
}
