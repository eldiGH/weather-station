import { router, publicProcedure } from '..';
import { Err, Ok } from '../../helpers/control';
import { loginInputSchema, registerInputSchema } from '../../schemas';
import { AuthService } from '../../services/AuthService';

export const authRouter = router({
  login: publicProcedure.input(loginInputSchema).mutation(async ({ input, ctx }) => {
    const { data: tokens, error } = await AuthService.login(input);
    if (error) {
      return Err(error);
    }

    const { accessToken, refreshToken } = tokens;

    ctx.setRefreshToken(refreshToken);
    return Ok({ accessToken, refreshTokenExpiry: refreshToken.expires });
  }),

  register: publicProcedure.input(registerInputSchema).mutation(async ({ input, ctx }) => {
    const { data: tokens, error } = await AuthService.register(input);
    if (error) {
      return Err(error);
    }

    const { accessToken, refreshToken } = tokens;

    ctx.setRefreshToken(refreshToken);
    return Ok({ accessToken, refreshTokenExpiry: refreshToken.expires });
  }),

  refresh: publicProcedure.mutation(async ({ ctx }) => {
    const { data: tokens, error } = await AuthService.refresh(ctx.getRefreshToken());
    if (error) {
      return Err(error);
    }

    const { accessToken, refreshToken } = tokens;

    ctx.setRefreshToken(refreshToken);
    return Ok({ accessToken, refreshTokenExpiry: refreshToken.expires });
  }),

  logout: publicProcedure.mutation(async ({ ctx }) => {
    const { error } = await AuthService.logout(ctx.getRefreshToken());
    if (error) {
      return Err(error);
    }

    ctx.deleteRefreshToken();

    return Ok();
  })
});
