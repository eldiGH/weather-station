import type { Response } from 'express';

export type Res<Locals extends Record<string, unknown> = Record<string, unknown>> = Response<
	unknown,
	Locals
>;
