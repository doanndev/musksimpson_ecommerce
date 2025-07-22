import type { z } from 'zod';
import type {
  CartItemCreateInputSchema,
  CartItemFilterSchema,
  CartItemIdSchema,
  CartItemParamsSchema,
  CartItemResponseSchema,
  CartItemUpdateInputSchema,
} from './schema';

export type CartItemCreateInputType = z.infer<typeof CartItemCreateInputSchema>;
export type CartItemUpdateInputType = z.infer<typeof CartItemUpdateInputSchema>;
export type CartItemResponseType = z.infer<typeof CartItemResponseSchema>;
export type CartItemParamsType = z.infer<typeof CartItemParamsSchema>;
export type CartItemFilterType = z.infer<typeof CartItemFilterSchema>;
export type CartItemIdType = z.infer<typeof CartItemIdSchema>;
