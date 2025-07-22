import type {
  categories,
  product_attributes,
  product_images,
  product_specifications,
  products,
  reviews,
} from 'prisma/generated/client';

export interface Product extends products {
  category?: categories | null;
  product_images?: product_images[];
  product_specifications?: ({
    product_attributes: product_attributes[];
  } & product_specifications)[];
  reviews?: reviews[];
}

export interface ProductFilter {
  productName?: string;
  categoryName?: string;
  sortByName?: 'asc' | 'desc';
  sortByDate?: 'newest' | 'oldest';
  limit?: number;
  offset?: number;
}

export interface ProductCreateInput {
  productId: string;
  productName: string;
  urlPath: string;
  priceNew: number;
  priceOdd: number;
  discountProduct: number;
  deliveryDay: string;
  deliveryPrice: number;
  rating: number;
  reviewCount: number;
  favoriteCount: number;
  thumbnailUrl: string;
  limitProduct: number;
  soldProduct: number;
  description: string;
  categoryId?: number;
  shopName: string;
  imageList?: string[];
  breadcrumbs?: { url: string; name: string }[];
  specifications?: {
    name: string;
    attributes?: { code: string; name: string; value: string }[];
  }[];
}

export interface ProductUpdateInput {
  productName?: string;
  urlPath?: string;
  priceNew?: number;
  priceOdd?: number;
  discountProduct?: number;
  deliveryDay?: string;
  deliveryPrice?: number;
  rating?: number;
  reviewCount?: number;
  favoriteCount?: number;
  thumbnailUrl?: string;
  limitProduct?: number;
  soldProduct?: number;
  description?: string;
  categoryId?: number;
  shopName?: string;
  imageList?: string[];
  breadcrumbs?: { url: string; name: string }[];
  specifications?: {
    name: string;
    attributes?: { code: string; name: string; value: string }[];
  }[];
}

export interface ProductResponseType {
  productId: string;
  productName: string;
  urlPath: string;
  priceNew: number;
  priceOdd: number;
  discountProduct: number;
  deliveryDay: string;
  deliveryPrice: number;
  rating: number;
  reviewCount: number;
  favoriteCount: number;
  thumbnailUrl: string;
  limitProduct: number;
  soldProduct: number;
  description: string;
  categoryId?: number;
  categoryName?: string;
  shopName: string;
  images?: string[];
  breadcrumbs?: { url: string; name: string; categoryId?: number }[];
  specifications?: {
    name: string;
    attributes?: { code: string; name: string; value: string }[];
  }[];
}
