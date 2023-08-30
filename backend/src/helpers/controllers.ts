import type {
  Controller,
  EndpointConfig,
  AuthEndpointConfig,
  EndpointCallback,
  Endpoint
} from '../types';

import type { InferType, Schema } from 'yup';

export const controller = (path: string): Controller => ({ path, endpoints: [] });

export const endpointFactory = (controller: Controller) => {
  return <
    BodySchema extends Schema = never,
    ParamsSchema extends Schema = never,
    QuerySchema extends Schema = never,
    Auth extends boolean = false
  >(
    endpointOptions:
      | EndpointConfig<BodySchema, ParamsSchema, QuerySchema>
      | AuthEndpointConfig<BodySchema, ParamsSchema, QuerySchema, Auth>,
    callback: EndpointCallback<
      InferType<BodySchema>,
      InferType<ParamsSchema>,
      InferType<QuerySchema>,
      Auth
    >
  ): Endpoint => {
    const endpoint = { auth: false, ...endpointOptions, callback } as Endpoint;

    controller.endpoints.push(endpoint);

    return endpoint;
  };
};
