import { object, ref, string, type InferType } from 'yup';

export const registerRequestSchema = object({
  email: string().required().email(),
  password: string().required().min(3).max(20)
});

export const registerRequestFormSchema = registerRequestSchema.shape({
  passwordRepeat: string()
    .required()
    .oneOf([ref('password')])
});

export type RegisterRequest = InferType<typeof registerRequestSchema>;
export type RegisterRequestForm = InferType<typeof registerRequestFormSchema>;

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
}
