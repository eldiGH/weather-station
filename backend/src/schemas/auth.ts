import { z } from 'zod';

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const registerInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3).max(20)
});

export type RegisterInput = z.infer<typeof registerInputSchema>;

export const registerInputFormSchema = registerInputSchema
  .extend({
    passwordRepeat: z.string()
  })
  .refine(({ password, passwordRepeat }) => password == passwordRepeat, "Passwords don't match");

export type RegisterInputForm = z.infer<typeof registerInputFormSchema>;
