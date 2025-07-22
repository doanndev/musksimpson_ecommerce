import type { z } from 'zod';
import type {
  OrderCreateInputSchema,
  OrderFilterSchema,
  OrderItemSchema,
  OrderResponseSchema,
  OrderStatusUpdateSchema,
  UuidParamSchema,
} from './schema';

export type OrderItem = z.infer<typeof OrderItemSchema>;
export type OrderCreateInput = z.infer<typeof OrderCreateInputSchema>;
export type OrderStatusUpdate = z.infer<typeof OrderStatusUpdateSchema>;
export type OrderResponse = z.infer<typeof OrderResponseSchema>;
export type UuidParam = z.infer<typeof UuidParamSchema>;
export type OrderFilter = z.infer<typeof OrderFilterSchema>;

export enum OrderStatusEnum {
  ALL = '',
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}
