import { type DataTransformer, TRPCError } from '@trpc/server';
import { stringify, parse } from 'devalue';
import { type ApiError, isApiError } from '../types/ApiError';
import { HttpStatus } from '../types';

const devalueTransformer: DataTransformer = {
  serialize: (object) => stringify(object),
  deserialize: (object) => {
    if (typeof object === 'string') {
      return parse(object);
    }

    return object;
  }
};

export const transformer = {
  input: devalueTransformer,
  output: devalueTransformer
};

const TRPC_ERROR_CODES_BY_KEY = {
  /**
   * Invalid JSON was received by the server.
   * An error occurred on the server while parsing the JSON text.
   */
  PARSE_ERROR: -32700,
  /**
   * The JSON sent is not a valid Request object.
   */
  BAD_REQUEST: -32600, // 400

  // Internal JSON-RPC error
  INTERNAL_SERVER_ERROR: -32603,
  NOT_IMPLEMENTED: -32603,

  // Implementation specific errors
  UNAUTHORIZED: -32001, // 401
  FORBIDDEN: -32003, // 403
  NOT_FOUND: -32004, // 404
  METHOD_NOT_SUPPORTED: -32005, // 405
  TIMEOUT: -32008, // 408
  CONFLICT: -32009, // 409
  PRECONDITION_FAILED: -32012, // 412
  PAYLOAD_TOO_LARGE: -32013, // 413
  UNPROCESSABLE_CONTENT: -32022, // 422
  TOO_MANY_REQUESTS: -32029, // 429
  CLIENT_CLOSED_REQUEST: -32099 // 499
} as const;

type TRPC_ERROR_CODE_KEY = keyof typeof TRPC_ERROR_CODES_BY_KEY;

const errorCodes = Object.keys(TRPC_ERROR_CODES_BY_KEY);

const convertError = (apiError: ApiError): TRPCError => {
  let code: TRPC_ERROR_CODE_KEY = 'INTERNAL_SERVER_ERROR';

  const status = HttpStatus[apiError.httpStatus];
  if (errorCodes.includes(status)) {
    code = status as TRPC_ERROR_CODE_KEY;
  }

  return new TRPCError({
    message: apiError.message,
    code,
    cause: apiError
  });
};

export const convertToTRPCService = <T extends { [key: string]: (...args: never[]) => unknown }>(
  service: T
): T => {
  const convertedService = {} as Record<string, (...args: never[]) => unknown>;

  const methods = Object.keys(service);

  for (const method of methods) {
    convertedService[method] = async (...args: never[]) => {
      try {
        return await service[method](...args);
      } catch (error) {
        if (!isApiError(error)) {
          console.error(error);
          throw error;
        }

        throw convertError(error);
      }
    };
  }

  return convertedService as T;
};
