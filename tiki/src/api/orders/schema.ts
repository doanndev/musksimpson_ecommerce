import { MESSAGES } from '@/lib/constants/messages';
import { z } from 'zod';
import { ProductResponseSchema } from '../products/schema';
import { UserResponseDataSchema } from '../user/schema';
import { OrderStatusEnum } from './type';

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
  status: z.nativeEnum(OrderStatusEnum),
});

export const OrderFilterSchema = z.object({
  user_id: z.string().uuid({ message: MESSAGES.INVALID_UUID }).optional(),
  status: z.nativeEnum(OrderStatusEnum).nullable().optional(),
  search: z.string().optional(),
  limit: z.coerce.number().int().positive().optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
  sort_by: z.enum(['uuid', 'user_id', 'created_at', 'updated_at']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
});

export const OrderResponseSchema = z.object({
  uuid: z.string().uuid(),
  user: UserResponseDataSchema.partial().optional(),
  address_id: z.number(),
  total_amount: z.number(),
  status: z.nativeEnum(OrderStatusEnum),
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

export const UuidParamSchema = z.object({
  uuid: z.string().uuid({ message: MESSAGES.INVALID_UUID }),
});
