import { z } from 'zod';
import { MESSAGES } from '../constants/messages.constant';
import { AddressResponseSchema } from './address.schema';

export const UserAttributesSchema = z.object({
  attributes: z
    .object({
      username: z.string().optional(),
      email: z.string().email({ message: MESSAGES.INVALID_EMAIL }).optional(),
      phone_number: z.string().optional(),
      full_name: z.string().optional(),
    })
    .refine((data) => Object.values(data).some((val) => val !== undefined), {
      message: MESSAGES.AT_LEAST_ONE_ATTRIBUTE_REQUIRED,
    }),
  operator: z.enum(['AND', 'OR']).optional().default('AND'),
});

export const UserFilterSchema = z.object({
  email: z.string().email({ message: MESSAGES.INVALID_EMAIL }).optional(),
  username: z.string().min(3, { message: MESSAGES.USERNAME_TOO_SHORT }).optional(),
  full_name: z.string().optional(),
  phone_number: z.string().optional(),
  sort_by_name: z.enum(['asc', 'desc']).optional(),
  sort_by_date: z.enum(['newest', 'oldest']).optional(),
  limit: z.coerce.number().int().positive().optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
  search: z.string().optional(),
});

export const UserCreateInputSchema = z.object({
  username: z.string().min(3, { message: MESSAGES.USERNAME_TOO_SHORT }),
  email: z.string().email({ message: MESSAGES.INVALID_EMAIL }),
  password: z.string().min(6, { message: MESSAGES.PASSWORD_TOO_SHORT }),
  full_name: z.string().nullable(),
  phone_number: z.string().nullable(),
  day_of_birth: z.string().nullable(),
  gender: z.boolean().optional(),
  avatar: z.string().optional(),
  role_id: z.number().int().positive().optional().default(1),
  is_public: z.boolean().optional().default(true),
  is_activated: z.boolean().optional().default(true),
});

export const UserUpdateInputSchema = UserCreateInputSchema.partial()
  .extend({
    two_factor_enabled: z.boolean().optional(),
  })
  .merge(UserCreateInputSchema.partial());

export const UserResponseDataSchema = z.object({
  uuid: z.string().uuid(),
  username: z.string(),
  full_name: z.string().nullable(),
  email: z.string().email(),
  phone_number: z.string().nullable(),
  day_of_birth: z.string().nullable(),
  is_public: z.boolean(),
  is_deleted: z.boolean(),
  gender: z.boolean().nullable(),
  role_id: z.number().int().positive(),
  avatar: z.string().nullable(),
  created_at: z.string().or(z.date()),
  updated_at: z.string().or(z.date()),
  addresses: z.array(AddressResponseSchema).optional(),
  provider: z.enum(['email', 'google', 'facebook']).optional().default('email'),
  provider_id: z.string().nullable().optional(),
  orders: z.array(z.any()).optional(),
  cart_items: z.array(z.any()).optional(),
  reviews: z.array(z.any()).optional(),
  conversations: z.array(z.any()).optional(),
  shops: z
    .array(
      z.object({
        name: z.string(),
        uuid: z.string().uuid().optional(),
      })
    )
    .optional(),
});

export const UserIdParamSchema = z.object({
  userId: z.string().uuid({ message: MESSAGES.INVALID_UUID }),
});

export const ResetPasswordTokenParamSchema = z.object({
  token: z.string(),
});

export type UserFilterType = z.infer<typeof UserFilterSchema>;
export type UserCreateInputType = z.infer<typeof UserCreateInputSchema>;
export type UserUpdateInputType = z.infer<typeof UserUpdateInputSchema>;
export type UserResponseDataType = z.infer<typeof UserResponseDataSchema>;
export type UserIdParamType = z.infer<typeof UserIdParamSchema>;
export type ResetPasswordTokenParamType = z.infer<typeof ResetPasswordTokenParamSchema>;
