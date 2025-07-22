import { z } from 'zod';
import { MESSAGES } from '~/libs/constants/messages.constant';
import { AddressResponseSchema } from './address.schema';

export const ShopResponseSchema = z.object({
  uuid: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  logo: z.string().nullable(),
  rating: z.number().nullable(),
  address: AddressResponseSchema.optional(),
  products: z.number().optional().nullable(),
  stock: z.number().optional().nullable(),
  purchases: z.number().optional().nullable(),
  is_active: z.boolean(),
  is_deleted: z.boolean(),
  created_at: z.string().or(z.date()),
  updated_at: z.string().or(z.date()),
});

const ShopBaseSchema = z.object({
  name: z.string().min(1, 'Shop name is required'),
  description: z.string().optional().nullable(),
  logo: z.string().url('Invalid logo URL').optional().nullable(),
  address_id: z.number().int().positive().optional().nullable(),
  is_active: z.boolean().optional().default(true),
});

export const ShopCreateInputSchema = ShopBaseSchema;
export const ShopUpdateInputSchema = ShopBaseSchema.partial();

export const ShopFilterSchema = z.object({
  name: z.string().optional(),
  seller_id: z.string().uuid('Invalid seller UUID').optional(),
  is_active: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().positive().optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
  sort_by: z.enum(['name', 'is_active']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
});

export const ShopIdParamSchema = z.object({
  shopId: z.string().uuid({ message: MESSAGES.INVALID_UUID }),
});

export type ShopResponseType = z.infer<typeof ShopResponseSchema>;
export type ShopCreateInputType = z.infer<typeof ShopCreateInputSchema>;
export type ShopUpdateInputType = z.infer<typeof ShopUpdateInputSchema>;
export type ShopFilterType = z.infer<typeof ShopFilterSchema>;
