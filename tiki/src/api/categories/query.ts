import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import { getCategoriesRequest, getCategoryByIdRequest, getCategoryBySlugRequest } from './request';
import type { CategoryFilter, CategoryResponse, UuidParam } from './type';

export enum CategoryQueryKey {
  CATEGORIES = 'categories',
  CATEGORY = 'category',
  CATEGORY_BY_SLUG = 'category_by_slug',
}

export const useCategoriesQuery = (
  params: CategoryFilter,
  options?: Omit<
    UseQueryOptions<CategoryResponse[], Error, CategoryResponse[], [CategoryQueryKey.CATEGORIES, CategoryFilter]>,
    'queryKey'
  >
) => {
  return useQuery({
    queryKey: [CategoryQueryKey.CATEGORIES, params],
    queryFn: () => getCategoriesRequest(params),
    ...options,
  });
};

export const useCategoryByIdQuery = (
  params: UuidParam,
  options?: Omit<
    UseQueryOptions<CategoryResponse, Error, CategoryResponse, [CategoryQueryKey.CATEGORY, UuidParam]>,
    'queryKey'
  >
) => {
  return useQuery({
    queryKey: [CategoryQueryKey.CATEGORY, params],
    queryFn: () => getCategoryByIdRequest(params),
    ...options,
  });
};

export const useCategoryBySlugQuery = (
  params: { slug: string },
  options?: Omit<
    UseQueryOptions<CategoryResponse, Error, CategoryResponse, [CategoryQueryKey.CATEGORY_BY_SLUG, { slug: string }]>,
    'queryKey'
  >
) => {
  return useQuery({
    queryKey: [CategoryQueryKey.CATEGORY_BY_SLUG, params],
    queryFn: () => getCategoryBySlugRequest(params),
    ...options,
  });
};
