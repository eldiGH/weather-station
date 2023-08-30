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
	return <MySchema extends Schema, Auth extends boolean = false>(
		endpointOptions: EndpointConfig<MySchema> | AuthEndpointConfig<MySchema, Auth>,
		callback: EndpointCallback<InferType<MySchema>, Auth>
	): Endpoint => {
		const endpoint = { auth: false, ...endpointOptions, callback } as Endpoint;

		controller.endpoints.push(endpoint);

		return endpoint;
	};
};
