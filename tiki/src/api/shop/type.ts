import type { z } from 'zod';
import type { ShopCreateInputSchema, ShopFilterSchema, ShopResponseSchema, ShopUpdateInputSchema } from './schema';

export type ShopResponseType = z.infer<typeof ShopResponseSchema>;
export type ShopCreateInputType = z.infer<typeof ShopCreateInputSchema>;
export type ShopUpdateInputType = z.infer<typeof ShopUpdateInputSchema>;
export type ShopFilterType = z.infer<typeof ShopFilterSchema>;
