import { z } from 'zod';
import { MESSAGES } from '../constants/messages.constant';

export const LoginRequestSchema = z
  .object({
    username: z.string().min(3, { message: MESSAGES.USERNAME_TOO_SHORT }).optional(),
    email: z.string().email({ message: MESSAGES.INVALID_EMAIL }).optional(),
    password: z.string().min(6, { message: MESSAGES.PASSWORD_TOO_SHORT }).optional(),
    twoFactorCode: z.string().optional(),
    provider: z.enum(['email', 'google', 'facebook']).default('email'),
    providerId: z.string().optional(),
    fullName: z.string().optional(),
    avatar: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.provider === 'email') {
        return (data.username || data.email) && data.password;
      }
      return data.email && data.providerId;
    },
    {
      message: 'Invalid login credentials',
    }
  );

export const RegisterRequestSchema = z
  .object({
    username: z.string().min(3, { message: MESSAGES.USERNAME_TOO_SHORT }).optional(),
    email: z.string().email({ message: MESSAGES.INVALID_EMAIL }),
    password: z.string().min(6, { message: MESSAGES.PASSWORD_TOO_SHORT }).optional(),
    fullName: z.string().optional(),
    avatar: z.string().optional(),
    provider: z.enum(['email', 'google', 'facebook']).default('email'),
    providerId: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.provider === 'email') {
        return data.username && data.password;
      }
      return data.providerId;
    },
    {
      message: 'Invalid registration data',
    }
  );

export const SocialLoginRequestSchema = z.object({
  email: z.string().email(),
  fullName: z.string(),
  avatar: z.string().optional(),
  provider: z.enum(['google', 'facebook']),
  providerId: z.string(),
  password: z.string().optional(),
});

export const ForgotPasswordRequestSchema = z.object({
  email: z.string().email({ message: MESSAGES.INVALID_EMAIL }),
});

export const ResetPasswordRequestSchema = z.object({
  password: z.string().min(6, { message: MESSAGES.PASSWORD_TOO_SHORT }),
});

export const TwoFactorRequestSchema = z.object({
  email: z.string().email({ message: MESSAGES.INVALID_EMAIL }),
  twoFactorCode: z.string().length(6, { message: MESSAGES.TWO_FACTOR_CODE_LENGTH }),
});

export const LoginResponseSchema = z.object({
  token: z.string().optional(),
  refreshToken: z.string().optional(),
  twoFactorRequired: z.boolean().optional(),
});

export const RegisterResponseSchema = z.object({
  token: z.string().optional(),
  refreshToken: z.string().optional(),
});

export const ResetPasswordTokenParamSchema = z.object({
  token: z.string(),
  userId: z.string().uuid({ message: MESSAGES.INVALID_UUID }),
});

export type LoginRequestType = z.infer<typeof LoginRequestSchema>;
export type RegisterRequestType = z.infer<typeof RegisterRequestSchema>;
export type RegisterResponseType = z.infer<typeof RegisterResponseSchema>;
export type SocialLoginRequestType = z.infer<typeof SocialLoginRequestSchema>;
export type ForgotPasswordRequestType = z.infer<typeof ForgotPasswordRequestSchema>;
export type ResetPasswordRequestType = z.infer<typeof ResetPasswordRequestSchema>;
export type TwoFactorRequestType = z.infer<typeof TwoFactorRequestSchema>;
export type LoginResponseType = z.infer<typeof LoginResponseSchema>;
export type ResetPasswordTokenParamType = z.infer<typeof ResetPasswordTokenParamSchema>;
