import { MESSAGES } from '@/lib/constants/messages';
import { z } from 'zod';

export const PaymentCreateInputSchema = z.object({
  user_id: z.string().uuid({ message: MESSAGES.INVALID_UUID }),
  amount: z.number().positive({ message: MESSAGES.INVALID_PRICE }),
  items: z.array(
    z.object({
      product_id: z.string().uuid({ message: MESSAGES.INVALID_UUID }),
      quantity: z.number().int().positive({ message: MESSAGES.INVALID_QUANTITY }),
      unit_price: z.number().positive({ message: MESSAGES.INVALID_PRICE }),
    })
  ),
});

export const PaymentResponseSchema = z.object({
  uuid: z.string().uuid(),
  order_id: z.number(),
  user_id: z.number(),
  amount: z.number(),
  provider: z.string(),
  transaction_id: z.string().nullable(),
  status: z.string(),
  is_deleted: z.boolean(),
  created_at: z.string().or(z.date()),
  updated_at: z.string().or(z.date()),
});
