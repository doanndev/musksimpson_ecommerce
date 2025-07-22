import type { z } from 'zod';
import type {
  CategoryBreadcrumbSchema,
  CategoryCreateInputSchema,
  CategoryFilterSchema,
  CategoryResponseSchema,
  CategoryUpdateInputSchema,
  UuidParamSchema,
} from './schema';

export type CategoryBreadcrumb = z.infer<typeof CategoryBreadcrumbSchema>;
export type CategoryCreateInput = z.infer<typeof CategoryCreateInputSchema>;
export type CategoryUpdateInput = z.infer<typeof CategoryUpdateInputSchema>;
export type CategoryResponse = z.infer<typeof CategoryResponseSchema>;
export type CategoryFilter = z.infer<typeof CategoryFilterSchema>;
export type UuidParam = z.infer<typeof UuidParamSchema>;
