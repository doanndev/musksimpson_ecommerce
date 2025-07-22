// payment.schema.ts
import { z } from "zod";
import { MESSAGES } from "../constants/messages.constant";

export const PaymentCreateInputSchema = z.object({
  user_id: z.string().uuid({ message: MESSAGES.INVALID_UUID }),
  items: z.array(
    z.object({
      product_id: z.string().uuid({ message: MESSAGES.INVALID_UUID }),
      quantity: z.number().int().positive(),
      unit_price: z.number().positive(),
      name: z.string(),
      description: z.string(),
      image_url: z.string(),
      url: z.string(),
      category: z.string(),
      sku: z.number().positive(),
    })
  ),
  amount: z.number().positive({ message: MESSAGES.INVALID_PRICE }),
});

export const PaymentResponseSchema = z.object({
  uuid: z.string().uuid(),
  order_id: z.number().nullable(), // Allow null initially
  user_id: z.number(),
  amount: z.number(),
  provider: z.string(),
  transaction_id: z.string().nullable(),
  status: z.string(),
  is_deleted: z.boolean(),
  created_at: z.string().or(z.date()),
  updated_at: z.string().or(z.date()),
});

export type PaymentResponseType = z.infer<typeof PaymentResponseSchema>;
export type PaymentCreateInputType = z.infer<typeof PaymentCreateInputSchema>;
