import instance, { getSuccessResponse } from '../axios';
import type { CategoryCreateInput, CategoryFilter, CategoryResponse, CategoryUpdateInput, UuidParam } from './type';

export const getCategoriesRequest = async (query: CategoryFilter) => {
  const response = await instance.get('/categories', { params: query });
  return getSuccessResponse<CategoryResponse[]>(response);
};

export const createCategoryRequest = async (data: CategoryCreateInput) => {
  const response = await instance.post('/categories', data);
  return getSuccessResponse<CategoryResponse>(response);
};

export const getCategoryByIdRequest = async ({ uuid }: UuidParam) => {
  const response = await instance.get(`/categories/${uuid}`);
  return getSuccessResponse<CategoryResponse>(response);
};

export const getCategoryBySlugRequest = async ({ slug }: { slug: string }) => {
  const response = await instance.get(`/categories/${slug}`);
  return getSuccessResponse<CategoryResponse>(response);
};

export const updateCategoryRequest = async ({ uuid, ...data }: UuidParam & CategoryUpdateInput) => {
  const response = await instance.put(`/categories/${uuid}`, data);
  return getSuccessResponse<CategoryResponse>(response);
};

export const deleteCategoryRequest = async ({ uuid }: UuidParam) => {
  const response = await instance.delete(`/categories/${uuid}`);
  return getSuccessResponse<null>(response);
};
