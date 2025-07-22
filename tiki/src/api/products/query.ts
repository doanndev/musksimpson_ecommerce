import { onMutateError } from '@/lib/utils';
import type { PaginatedResponse } from '@/types';
import { type UseMutationOptions, type UseQueryOptions, useMutation, useQuery } from '@tanstack/react-query';
import {
  calculateShippingFeeRequest,
  createProductRequest,
  deleteProductRequest,
  getProductByIdRequest,
  getProductsRequest,
  updateProductRequest,
} from './request';
import type { ProductCreateInputType, ProductResponseType } from './schema';
import type { ProductFilter, ProductIdParam } from './type';

export enum ProductQueryKey {
  PRODUCTS = 'products',
  PRODUCT = 'product',
}

export const useProductsQuery = (
  params: ProductFilter,
  options?: Omit<
    UseQueryOptions<
      PaginatedResponse<ProductResponseType>['data'],
      Error,
      PaginatedResponse<ProductResponseType>['data'],
      [ProductQueryKey.PRODUCTS, ProductFilter]
    >,
    'queryKey'
  >
) => {
  return useQuery({
    queryKey: [ProductQueryKey.PRODUCTS, params],
    queryFn: () => getProductsRequest(params),
    ...options,
  });
};

export const useProductByIdQuery = (
  params: ProductIdParam,
  options?: Omit<
    UseQueryOptions<ProductResponseType, Error, ProductResponseType, [ProductQueryKey.PRODUCT, ProductIdParam]>,
    'queryKey'
  >
) => {
  return useQuery({
    queryKey: [ProductQueryKey.PRODUCT, params],
    queryFn: () => getProductByIdRequest(params),
    ...options,
  });
};

export const useCalculateShippingFeeQuery = (uuids: string[], enabled = false) => {
  return useQuery({
    queryKey: ['calculateShippingFee', uuids],
    queryFn: () => calculateShippingFeeRequest({ uuids }),
    enabled,
  });
};
export const useCreateProductMutation = (
  options?: UseMutationOptions<ProductResponseType, Error, ProductCreateInputType, unknown>
) =>
  useMutation({
    mutationFn: (params: ProductCreateInputType) => createProductRequest(params),
    onError: onMutateError,
    ...options,
  });

export const useUpdateProductMutation = (
  options?: UseMutationOptions<ProductResponseType, Error, { productId: string; data: ProductCreateInputType }, unknown>
) =>
  useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: ProductCreateInputType }) =>
      updateProductRequest({ productId, ...data }),
    onError: onMutateError,
    ...options,
  });

export const useDeleteProductMutation = (options?: UseMutationOptions<null[], Error, string[], unknown>) =>
  useMutation({
    mutationFn: (productIds: string[]) => Promise.all(productIds.map((id) => deleteProductRequest({ productId: id }))),
    onError: onMutateError,
    ...options,
  });
