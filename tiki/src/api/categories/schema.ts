import { MESSAGES } from '@/lib/constants/messages';
import { z } from 'zod';

export const CategoryBreadcrumbSchema = z.object({
  name: z.string().min(1, { message: MESSAGES.ADDRESS_REQUIRED }),
  path: z.string().min(1, { message: MESSAGES.ADDRESS_REQUIRED }),
  level: z.number().int().nonnegative(),
});

export const CategoryCreateInputSchema = z.object({
  name: z.string().min(1, { message: MESSAGES.ADDRESS_REQUIRED }),
  description: z.string().optional(),
  parent_id: z.string().uuid().optional(),
  breadcrumbs: z.array(CategoryBreadcrumbSchema).optional().default([]),
});

export const CategoryUpdateInputSchema = CategoryCreateInputSchema.partial();

export const CategoryResponseSchema = z.object({
  uuid: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  icon: z.string().nullable(),
  parent_id: z.number().nullable(),
  is_deleted: z.boolean(),
  created_at: z.string().or(z.date()),
  updated_at: z.string().or(z.date()),
});

export const UuidParamSchema = z.object({
  uuid: z.string().uuid({ message: MESSAGES.INVALID_UUID }),
});

export const CategoryFilterSchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
  parent: z.enum(['true', 'false']).optional(),
  slug: z.string().optional(),
});
