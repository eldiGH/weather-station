import { object, string, type InferType } from 'yup';

export const logoutRequestSchema = object({
  refreshToken: string().required()
});

export type LogoutRequest = InferType<typeof logoutRequestSchema>;
