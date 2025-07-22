import type { z } from 'zod';
import type { ReviewCreateInputSchema, ReviewFilterSchema, ReviewResponseSchema, UuidParamSchema } from './schema';

export type ReviewCreateInput = z.infer<typeof ReviewCreateInputSchema>;
export type ReviewResponse = z.infer<typeof ReviewResponseSchema>;
export type ReviewFilter = z.infer<typeof ReviewFilterSchema>;
export type UuidParam = z.infer<typeof UuidParamSchema>;
