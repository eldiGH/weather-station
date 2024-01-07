import { initTRPC } from '@trpc/server';
import { transformer } from '../helpers/trpc';
import { AuthServiceTRPC } from './services';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import cookie from 'cookie';
import { isProduction } from '../helpers/environment';

const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';

export const createContext = (opts: CreateFastifyContextOptions) => {
  const { req, res } = opts;

  const setCookie = (
    name: string,
    value: string,
    cookieOptions?: cookie.CookieSerializeOptions
  ) => {
    const options: cookie.CookieSerializeOptions = {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
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
    setCookie(REFRESH_TOKEN_COOKIE_NAME, token, { expires });

  return { req, setCookie, getCookie, getRefreshToken, setRefreshToken };
};

export const { router, procedure: publicProcedure } = initTRPC
  .context<typeof createContext>()
  .create({
    transformer,
    errorFormatter: (err) => {
      return { ...err.shape, data: { ...err.error.cause } };
    }
  });

export const authedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const { req } = ctx;

  const accessToken = req.headers.authorization;

  const user = await AuthServiceTRPC.authorize(accessToken);

  return next({ ctx: { user } });
});
