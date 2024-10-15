import { router, publicProcedure } from '..';
import { loginInputSchema, registerInputSchema } from '../../schemas';
import { AuthServiceTRPC } from '../services';

export const authRouter = router({
  login: publicProcedure.input(loginInputSchema).mutation(async ({ input, ctx }) => {
    const tokens = await AuthServiceTRPC.login(input);

    ctx.setRefreshToken(tokens.refreshToken);
    return tokens.accessToken;
  }),

  register: publicProcedure.input(registerInputSchema).mutation(async ({ input, ctx }) => {
    const tokens = await AuthServiceTRPC.register(input);

    ctx.setRefreshToken(tokens.refreshToken);
    return tokens.accessToken;
  }),

  refresh: publicProcedure.mutation(async ({ ctx }) => {
    const tokens = await AuthServiceTRPC.refresh(ctx.getRefreshToken());

    ctx.setRefreshToken(tokens.refreshToken);
    return tokens.accessToken;
  }),

  logout: publicProcedure.mutation(async ({ ctx }) => {
    await AuthServiceTRPC.logout(ctx.getRefreshToken());

    ctx.deleteRefreshToken();
  })
});
