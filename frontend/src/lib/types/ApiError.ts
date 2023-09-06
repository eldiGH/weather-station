import type { ApiErrorCode } from 'shared';

interface ErrorBody {
	errorCode: ApiErrorCode;
	message: string;
}

export class ApiError extends Error {
	errorCode: ApiErrorCode;

	constructor(body: ErrorBody) {
		super(body.message);

		this.errorCode = body.errorCode;
	}
}
