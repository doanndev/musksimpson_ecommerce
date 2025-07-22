import { z } from 'zod';
import { UserResponseDataSchema } from './user.schema';

export const ErrorResponseSchema = z
  .object({
    error: z.string(),
    data: z.any().nullable(),
    statusCode: z.number(),
  })
  .describe('Error response');

export const SuccessResponseSchema = z
  .object({
    message: z.string(),
    data: z.any(),
    statusCode: z.number(),
  })
  .describe('Success response');

export const PaginatedResponseSchema = z
  .object({
    message: z.string(),
    data: z.object({
      items: z.array(UserResponseDataSchema),
      meta: z.object({
        page: z.number(),
        limit: z.number(),
        totalPage: z.number(),
        totalItem: z.number(),
      }),
    }),
    statusCode: z.number(),
  })
  .describe('Paginated response');

export const RoleEnum = z.enum(['ADMIN', 'USER', 'SELLER']);

export const PermissionEnum = z.enum(['VIEW_PRODUCTS', 'MANAGE_ORDERS', 'EDIT_USERS', 'MANAGE_CATEGORIES']);

export const AuthPayloadSchema = z.object({
  userId: z.string().uuid(),
  roleId: z.number().int().positive(),
});

export const PaginationSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  totalPage: z.number().int().positive(),
  totalItem: z.number().int().nonnegative(),
});

export const IdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const UuidParamSchema = z.object({
  uuid: z.string().uuid(),
});

export type RoleType = z.infer<typeof RoleEnum>;
export type PaginationType = z.infer<typeof PaginationSchema>;
export type AuthPayloadType = z.infer<typeof AuthPayloadSchema>;
export type PermissionType = z.infer<typeof PermissionEnum>;
export type ErrorResponseType = z.infer<typeof ErrorResponseSchema>;
export type SuccessResponseType = z.infer<typeof SuccessResponseSchema>;
export type PaginatedResponseType = z.infer<typeof PaginatedResponseSchema>;
