import { router, publicProcedure } from '..';
import {
  loginInputSchema,
  logoutInputSchema,
  refreshInputSchema,
  registerInputSchema
} from '../../schemas';
import { AuthServiceTRPC } from '../services';

export const authRouter = router({
  login: publicProcedure
    .input(loginInputSchema)
    .mutation(({ input }) => AuthServiceTRPC.login(input)),

  register: publicProcedure
    .input(registerInputSchema)
    .mutation(({ input }) => AuthServiceTRPC.register(input)),

  refresh: publicProcedure
    .input(refreshInputSchema)
    .mutation(({ input }) => AuthServiceTRPC.refresh(input.refreshToken)),

  logout: publicProcedure
    .input(logoutInputSchema)
    .mutation(({ input }) => AuthServiceTRPC.logout(input.refreshToken))
});
