import { TRPCError, initTRPC } from '@trpc/server';
import { transformer } from '../helpers/trpc';
import { AuthService } from '../services/AuthService';
import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import cookie from 'cookie';
import type { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';
import { WebSocket } from 'ws';
import { fromUnixTime } from 'date-fns';
import { ZodError } from 'zod';
import { isApiError } from '../types';
import { isDevelopment } from '../helpers/environment';
import { isApiResponse } from '../types/Control';
import { ValidationError } from '../errors/ValidationError';
import { InternalServerError } from '../errors';

const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';

export const createContext = (opts: CreateFastifyContextOptions | CreateWSSContextFnOptions) => {
  const { req, res } = opts;

  const isHttp = !(res instanceof WebSocket);

  const setCookie = (name: string, value: string, cookieOptions?: cookie.SerializeOptions) => {
    if (!isHttp) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Cannot set cookie from websocket connection. Use http client'
      });
    }

    const options: cookie.SerializeOptions = {
      httpOnly: true,
      sameSite: 'lax',
      secure: !isDevelopment,
      ...cookieOptions
    };

    res.header('set-cookie', cookie.serialize(name, value, options));
  };

  const getCookie = (name: string) => {
    const cookieHeader = req.headers.cookie;

    if (!cookieHeader) {
      return undefined;
    }

    const cookies = cookie.parse(cookieHeader);

    const c = cookies[name];

    return c;
  };

  const getRefreshToken = () => getCookie(REFRESH_TOKEN_COOKIE_NAME);
  const setRefreshToken = ({ token, expires }: { token: string; expires: Date }) =>
    setCookie(REFRESH_TOKEN_COOKIE_NAME, token, { expires, path: '/' });
  const deleteRefreshToken = () =>
    setCookie(REFRESH_TOKEN_COOKIE_NAME, '', { expires: fromUnixTime(0), path: '/' });

  return {
    req,
    setCookie,
    getCookie,
    getRefreshToken,
    setRefreshToken,
    deleteRefreshToken,
    isHttp
  };
};

export const {
  router,
  procedure: publicProcedure,
  middleware
} = initTRPC.context<typeof createContext>().create({
  transformer: {
    input: transformer.input,
    output: {
      serialize: (a) => {
        if (isApiResponse(a)) {
          if (a.error) {
            throw a.error;
          }

          return transformer.output.serialize(a.data);
        }

        throw new Error('Response from procedure is not of type ApiResponse.', a);
      },
      deserialize: transformer.output.deserialize
    }
  },
  errorFormatter: (err) => {
    let error;

    if (isApiError(err.error.cause)) {
      error = err.error.cause;
    } else if (err.error.cause instanceof ZodError) {
      error = ValidationError(err.error.cause);
    } else {
      console.error('Unknown error.', err);
      error = InternalServerError();
    }

    return {
      message: error.message,
      code: error.errorCode,
      data: { ...error, code: err.shape.code }
    };
  }
});

export const authedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const { req } = ctx;

  let accessToken = req.headers.authorization;

  if (!accessToken && req.headers.cookie) {
    accessToken = `Bearer ${cookie.parse(req.headers.cookie).accessToken}`;
  }

  const { data: user, error } = await AuthService.authorize(accessToken);
  if (error) {
    throw error;
  }

  return next({ ctx: { user } });
});
