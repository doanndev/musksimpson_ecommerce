import { MESSAGES } from '@/lib/constants/messages';
import { z } from 'zod';

export const ReviewCreateInputSchema = z.object({
  user_id: z.string().uuid({ message: MESSAGES.INVALID_UUID }),
  product_id: z.string().uuid({ message: MESSAGES.INVALID_UUID }),
  rating: z.number().int().min(1).max(5, { message: MESSAGES.INVALID_RATING }),
  comment: z.string().optional(),
});

export const ReviewResponseSchema = z.object({
  uuid: z.string().uuid(),
  user_id: z.number(),
  product_id: z.number(),
  rating: z.number(),
  comment: z.string().nullable(),
  is_deleted: z.boolean(),
  created_at: z.string().or(z.date()),
  updated_at: z.string().or(z.date()),
});

export const ReviewFilterSchema = z.object({
  product_id: z.string().uuid({ message: MESSAGES.INVALID_UUID }).optional(),
  min_rating: z.coerce.number().int().min(1).max(5).optional(),
  max_rating: z.coerce.number().int().min(1).max(5).optional(),
  limit: z.coerce.number().int().positive().optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
});

export const UuidParamSchema = z.object({
  uuid: z.string().uuid({ message: MESSAGES.INVALID_UUID }),
});
