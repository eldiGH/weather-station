import cors, { type CorsOptions } from 'cors';

const config: CorsOptions = {
	origin: '*'
};

export const corsMiddleware = cors(config);
