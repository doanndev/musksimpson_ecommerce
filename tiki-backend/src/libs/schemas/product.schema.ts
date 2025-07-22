import { z } from 'zod';
import { MESSAGES } from '../constants/messages.constant';
import { ReviewResponseSchema } from './review.schema';
import { ShopResponseSchema } from './shop.schema';

const ProductBaseSchema = z.object({
    name: z.string().min(1, 'Product name is required'),
    description: z.string().optional().nullable(),
    old_price: z.number().positive('Old price must be positive').optional(),
    new_price: z.number().positive('New price must be positive'),
    stock: z.number().int().nonnegative('Stock must be non-negative'),
    category_id: z.string().uuid('Invalid category UUID'),
    shop_id: z.string().uuid('Invalid shop UUID'), // Thêm shop_id
    images: z
        .array(
            z.object({
                url: z.string().url('Invalid image URL'),
                is_primary: z.boolean().default(false),
            })
        )
        .optional(),
    specifications: z
        .array(
            z.object({
                key: z.string().min(1, 'Specification key is required'),
                value: z.string().optional().nullable(),
                attributes: z
                    .array(
                        z.object({
                            name: z.string().min(1, 'Attribute name is required'),
                            value: z.string().min(1, 'Attribute value is required'),
                        })
                    )
                    .optional(),
            })
        )
        .optional(),
});

// Create schema với refinements
export const ProductCreateInputSchema = ProductBaseSchema.refine(
    (data) => {
        if (data.old_price && data.new_price) {
            return data.old_price >= data.new_price;
        }
        return true;
    },
    {
        message: 'Old price must be greater than or equal to new price',
        path: ['old_price'],
    }
);

// Update schema dựa trên base schema, tất cả các trường là tùy chọn
export const ProductUpdateInputSchema = ProductBaseSchema.partial().refine(
    (data) => {
        if (data.old_price && data.new_price) {
            return data.old_price >= data.new_price;
        }
        return true;
    },
    {
        message: 'Old price must be greater than or equal to new price',
        path: ['old_price'],
    }
);

// Các schema khác
export const ProductImageSchema = z.object({
    url: z.string().url({ message: MESSAGES.INVALID_UUID }),
    is_primary: z.boolean().optional().default(false),
});

export const ProductSpecificationSchema = z.object({
    key: z.string().optional(),
    value: z.string().optional(),
});

export const ProductAttributeSchema = z.object({
    name: z.string().optional(),
    value: z.string().optional(),
});

export const ProductResponseSchema = z.object({
    uuid: z.string().uuid(),
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    old_price: z.number().nullable(),
    new_price: z.number(),
    discount_percentage: z.number().nullable(),
    stock: z.number(),
    sold: z.number(),
    category_id: z.string().uuid(),
    shop: ShopResponseSchema.nullable(),
    is_deleted: z.boolean(),
    images: z.array(ProductImageSchema).optional(),
    specifications: z
        .array(
            z.object({
                key: z.string(),
                value: z.string().nullable(),
                attributes: z.array(ProductAttributeSchema).optional(),
            })
        )
        .optional(),
    breadcrumbs: z
        .array(
            z.object({
                id: z.number(),
                parent_id: z.number().nullable(),
                name: z.string(),
                slug: z.string(),
            })
        )
        .optional(),
    reviews: z.array(ReviewResponseSchema).optional(),
    average_rating: z.number(),
    fee: z.number().optional().nullable(),
    estimated_delivery_date: z.string().optional().nullable(),
    created_at: z.string().or(z.date()),
    updated_at: z.string().or(z.date()),
});

export const ProductFilterSchema = z.object({
    name: z.string().optional(),
    category_id: z.string().uuid().optional(),
    min_price: z.coerce.number().positive().optional(),
    max_price: z.coerce.number().positive().optional(),
    sort_order: z.enum(['asc', 'desc']).optional(),
    sort_by: z.enum(['name', 'price', 'stock', 'created_at', 'updated_at']).optional(),
    limit: z.coerce.number().int().positive().optional(),
    offset: z.coerce.number().int().nonnegative().optional(),
    shop_id: z.string().uuid().optional(),
});

export const ProductIdParamSchema = z.object({
    productId: z.string().uuid({ message: MESSAGES.INVALID_UUID }),
});

export type ProductImageType = z.infer<typeof ProductImageSchema>;
export type ProductSpecificationType = z.infer<typeof ProductSpecificationSchema>;
export type ProductAttributeType = z.infer<typeof ProductAttributeSchema>;
export type ProductCreateInputType = z.infer<typeof ProductCreateInputSchema>;
export type ProductUpdateInputType = z.infer<typeof ProductUpdateInputSchema>;
export type ProductResponseType = z.infer<typeof ProductResponseSchema>;
export type ProductFilterType = z.infer<typeof ProductFilterSchema>;
