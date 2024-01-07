import { router, publicProcedure, authedProcedure } from '..';
import { loginInputSchema, registerInputSchema } from '../../schemas';
import { AuthServiceTRPC } from '../services';

export const authRouter = router({
  login: publicProcedure.input(loginInputSchema).mutation(async ({ input, ctx }) => {
    const tokens = await AuthServiceTRPC.login(input);

    ctx.setRefreshToken(tokens.refreshToken);
    return tokens.accessToken;
  }),

  register: publicProcedure
    .input(registerInputSchema)
    .mutation(({ input }) => AuthServiceTRPC.register(input)),

  refresh: authedProcedure.mutation(async ({ ctx }) => {
    const tokens = await AuthServiceTRPC.refresh(ctx.getRefreshToken());

    ctx.setRefreshToken(tokens.refreshToken);
    return tokens.accessToken;
  }),

  logout: publicProcedure.mutation(({ ctx }) => AuthServiceTRPC.logout(ctx.getRefreshToken()))
});
