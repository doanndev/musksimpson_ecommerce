import { MESSAGES } from '@/lib/constants/messages';
import { z } from 'zod';
import { ProductResponseSchema } from '../products/schema';

export const CartItemCreateInputSchema = z.object({
  user_id: z.string().uuid({ message: MESSAGES.INVALID_UUID }),
  product_id: z.string().uuid({ message: MESSAGES.INVALID_UUID }),
  quantity: z.number().int().positive({ message: MESSAGES.INVALID_QUANTITY }),
});

export const CartItemUpdateInputSchema = z.object({
  quantity: z.number().int().positive({ message: MESSAGES.INVALID_QUANTITY }),
});

export const CartItemResponseSchema = z.object({
  id: z.number().int().positive(),
  user_id: z.number(),
  product_id: z.number(),
  quantity: z.number(),
  created_at: z.string().or(z.date()),
  updated_at: z.string().or(z.date()),
  product: ProductResponseSchema,
});

export const CartItemParamsSchema = z.object({
  user_id: z.string().uuid({ message: MESSAGES.INVALID_UUID }).optional(),
});

export const CartItemIdSchema = z.object({
  id: z.number().int().positive({ message: MESSAGES.INVALID_ID }),
});

export const CartItemFilterSchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
});
