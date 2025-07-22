import { z } from 'zod';
import { MESSAGES } from '../constants/messages.constant';
import { ProductResponseSchema } from './product.schema';

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
  product: ProductResponseSchema.optional(),
});

export const CartItemParamsSchema = z.object({
  user_id: z.string().uuid({ message: MESSAGES.INVALID_UUID }).optional(),
});

export const CartItemFilterSchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
});

export type CartItemCreateInputType = z.infer<typeof CartItemCreateInputSchema>;
export type CartItemUpdateInputType = z.infer<typeof CartItemUpdateInputSchema>;
export type CartItemResponseType = z.infer<typeof CartItemResponseSchema>;
export type CartItemParamsType = z.infer<typeof CartItemParamsSchema>;
export type CartItemFilterType = z.infer<typeof CartItemFilterSchema>;
