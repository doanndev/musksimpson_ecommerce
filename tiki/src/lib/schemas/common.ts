import { z } from 'zod';
import { MESSAGES } from '../constants/messages';
import { RoleEnum } from '../constants/role';

export const AuthPayloadSchema = z.object({
  userId: z.string().uuid(),
  roleId: z.nativeEnum(RoleEnum),
});

export type AuthPayloadType = z.infer<typeof AuthPayloadSchema>;

export const MetaSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  totalPage: z.number().int().positive(),
  totalItem: z.number().int().nonnegative(),
});

export type MetaType = z.infer<typeof MetaSchema>;

export const SuccessResponseSchema = z
  .object({
    message: z.string(),
    data: z.any(),
    statusCode: z.literal(200),
  })
  .describe('Success response');

export type SuccessResponseType = z.infer<typeof SuccessResponseSchema>;

export const PaginatedResponseSchema = z
  .object({
    message: z.string(),
    data: z.object({
      items: z.array(z.any()),
      meta: MetaSchema,
    }),
    statusCode: z.literal(200),
  })
  .describe('Paginated response');

export type PaginatedResponseType = z.infer<typeof PaginatedResponseSchema>;

export const ErrorResponseSchema = z
  .object({
    error: z.string(),
    data: z.any().nullable(),
    statusCode: z.union([
      z.literal(400),
      z.literal(401),
      z.literal(403),
      z.literal(404),
      z.literal(429),
      z.literal(500),
    ]),
  })
  .describe('Error response');

export type ErrorResponseType = z.infer<typeof ErrorResponseSchema>;

export const IdParamSchema = z.object({
  id: z.string().uuid({ message: MESSAGES.INVALID_UUID }),
});

export type IdParamType = z.infer<typeof IdParamSchema>;
