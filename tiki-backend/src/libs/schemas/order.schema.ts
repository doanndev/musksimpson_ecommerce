import { z } from 'zod';
import { MESSAGES } from '../constants/messages.constant';
import { OrderStatusEnum } from '../types/order.types';
import { ProductResponseSchema } from './product.schema';
import { UserResponseDataSchema } from './user.schema';

export const OrderItemSchema = z.object({
  product_id: z.string().uuid({ message: MESSAGES.INVALID_UUID }),
  quantity: z.number().int().positive({ message: MESSAGES.INVALID_QUANTITY }),
});

export const OrderCreateInputSchema = z.object({
  user_id: z.string().uuid({ message: MESSAGES.INVALID_UUID }),
  address_id: z.number().int().positive(),
  items: z.array(OrderItemSchema).min(1, { message: MESSAGES.ADDRESS_REQUIRED }),
});

export const OrderStatusUpdateSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPING', 'DELIVERED', 'CANCELLED']),
});

export const OrderFilterSchema = z.object({
  user_id: z.string().uuid({ message: MESSAGES.INVALID_UUID }).optional(),
  status: z.nativeEnum(OrderStatusEnum).optional(),
  search: z.string().optional(),
  limit: z.coerce.number().int().positive().optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
  sort_by: z.enum(['created_at', 'updated_at']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
});

export const OrderResponseSchema = z.object({
  uuid: z.string().uuid(),
  user: UserResponseDataSchema.partial().optional(),
  address_id: z.number(),
  total_amount: z.number(),
  status: z.string(),
  is_deleted: z.boolean(),
  items: z
    .array(
      z.object({
        product_id: z.number().int().positive(),
        quantity: z.number().int().positive(),
        unit_price: z.number().positive(),
        product: ProductResponseSchema.partial().optional(),
      })
    )
    .optional(),
  created_at: z.string().or(z.date()),
  updated_at: z.string().or(z.date()),
});

export type OrderItemType = z.infer<typeof OrderItemSchema>;
export type OrderCreateInputType = z.infer<typeof OrderCreateInputSchema>;
export type OrderStatusUpdateType = z.infer<typeof OrderStatusUpdateSchema>;
export type OrderResponseType = z.infer<typeof OrderResponseSchema>;
export type OrderFilterType = z.infer<typeof OrderFilterSchema>;
