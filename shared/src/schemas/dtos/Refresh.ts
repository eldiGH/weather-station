import { object, string, type InferType } from 'yup';

export const refreshRequestSchema = object({
  refreshToken: string().required()
});

export type RefreshRequest = InferType<typeof refreshRequestSchema>;

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}
