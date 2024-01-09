import { TRPCError, initTRPC } from '@trpc/server';
import { transformer } from '../helpers/trpc';
import { AuthServiceTRPC } from './services';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import cookie from 'cookie';
import { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';
import { WebSocket } from 'ws';
import { fromUnixTime } from 'date-fns';
import { ZodError } from 'zod';
import { isApiError } from '../types';

const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';

export const createContext = (opts: CreateFastifyContextOptions | CreateWSSContextFnOptions) => {
  const { req, res } = opts;

  const isHttp = !(res instanceof WebSocket);

  const setCookie = (
    name: string,
    value: string,
    cookieOptions?: cookie.CookieSerializeOptions
  ) => {
    if (!isHttp) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Cannot set cookie from websocket connection. Use http client'
      });
    }

    const options: cookie.CookieSerializeOptions = {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
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
  transformer,
  errorFormatter: (err) => {
    let data = {};

    if (isApiError(err.error.cause)) {
      data = { ...err.error.cause };
    } else if (err.error.cause instanceof ZodError) {
      data = { issues: [...err.error.cause.issues] };
    } else if (err.error.cause instanceof Error) {
      data = { ...err.error.cause };
    }

    return { ...err.shape, data };
  }
});

export const authedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const { req } = ctx;

  let accessToken = req.headers.authorization;

  if (!accessToken && req.headers.cookie) {
    accessToken = `Bearer ${cookie.parse(req.headers.cookie).accessToken}`;
  }

  const user = await AuthServiceTRPC.authorize(accessToken);

  return next({ ctx: { user } });
});
