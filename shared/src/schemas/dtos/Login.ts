import { object, string, type InferType } from 'yup';

export const loginRequestSchema = object({
  email: string().required().email(),
  password: string().required()
});

export type LoginRequest = InferType<typeof loginRequestSchema>;

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}
