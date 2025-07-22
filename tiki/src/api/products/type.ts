import type { z } from 'zod';
import type {
  ProductAttributeSchema,
  ProductCreateInputSchema,
  ProductFilterSchema,
  ProductIdParamSchema,
  ProductImageSchema,
  ProductResponseSchema,
  ProductSpecificationSchema,
  ProductUpdateInputSchema,
} from './schema';

export type ProductImage = z.infer<typeof ProductImageSchema>;
export type ProductSpecification = z.infer<typeof ProductSpecificationSchema>;
export type ProductAttribute = z.infer<typeof ProductAttributeSchema>;
export type ProductCreateInput = z.infer<typeof ProductCreateInputSchema>;
export type ProductUpdateInput = z.infer<typeof ProductUpdateInputSchema>;
export type ProductResponse = z.infer<typeof ProductResponseSchema>;
export type ProductFilter = z.infer<typeof ProductFilterSchema>;
export type ProductIdParam = z.infer<typeof ProductIdParamSchema>;
export type CalculateFeeRequest = {
  uuids: string[];
};

export type CalculateFeeResponse = {
  fee: number;
};
