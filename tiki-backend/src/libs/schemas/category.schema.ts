import { z } from 'zod';
import { MESSAGES } from '../constants/messages.constant';

export const CategoryBreadcrumbSchema = z.object({
  name: z.string().min(1, { message: MESSAGES.ADDRESS_REQUIRED }),
  path: z.string().min(1, { message: MESSAGES.ADDRESS_REQUIRED }),
  level: z.number().int().nonnegative(),
});

export const CategoryCreateInputSchema = z.object({
  name: z.string().min(1, { message: MESSAGES.ADDRESS_REQUIRED }),
  icon: z.string().optional(),
  parent_id: z.string().uuid().optional(),
  breadcrumbs: z.array(CategoryBreadcrumbSchema).optional().default([]),
});

export const CategoryUpdateInputSchema = CategoryCreateInputSchema.partial();

export const CategoryResponseSchema = z.object({
  uuid: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  parent_id: z.number().nullable(),
  is_deleted: z.boolean(),
  breadcrumbs: z.array(CategoryBreadcrumbSchema).optional(),
  created_at: z.string().or(z.date()),
  updated_at: z.string().or(z.date()),
});

export type CategoryBreadcrumbType = z.infer<typeof CategoryBreadcrumbSchema>;
export type CategoryCreateInputType = z.infer<typeof CategoryCreateInputSchema>;
export type CategoryUpdateInputType = z.infer<typeof CategoryUpdateInputSchema>;
export type CategoryResponseType = z.infer<typeof CategoryResponseSchema>;
