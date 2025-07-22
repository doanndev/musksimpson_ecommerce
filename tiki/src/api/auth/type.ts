import type { z } from 'zod';
import type {
  ForgotPasswordRequestSchema,
  LoginRequestSchema,
  LoginResponseSchema,
  RegisterRequestSchema,
  RegisterResponseSchema,
  ResetPasswordRequestSchema,
  ResetPasswordTokenParamSchema,
  SocialLoginRequestSchema,
  TwoFactorRequestSchema,
} from './schema';

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type SocialLoginRequest = z.infer<typeof SocialLoginRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;
export type TwoFactorRequest = z.infer<typeof TwoFactorRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type ResetPasswordTokenParam = z.infer<typeof ResetPasswordTokenParamSchema>;
