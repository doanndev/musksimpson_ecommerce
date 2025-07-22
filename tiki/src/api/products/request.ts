import instance, { getPaginatedResponse, getSuccessResponse } from '../axios';
import type {
  CalculateFeeRequest,
  CalculateFeeResponse,
  ProductCreateInput,
  ProductFilter,
  ProductIdParam,
  ProductResponse,
  ProductUpdateInput,
} from './type';

export const getProductsRequest = async (filter?: ProductFilter) => {
  const response = await instance.get('/products', { params: filter });
  return getPaginatedResponse<ProductResponse>(response);
};

export const createProductRequest = async (data: ProductCreateInput) => {
  const response = await instance.post('/products', data);
  return getSuccessResponse<ProductResponse>(response);
};

export const getProductByIdRequest = async ({ productId }: ProductIdParam) => {
  const response = await instance.get(`/products/${productId}`);
  return getSuccessResponse<ProductResponse>(response);
};

export const calculateShippingFeeRequest = async ({ uuids }: CalculateFeeRequest) => {
  const response = await instance.post('/products/calculate-fee', { uuids });
  return getSuccessResponse<CalculateFeeResponse>(response);
};

export const updateProductRequest = async ({ productId, ...data }: ProductIdParam & ProductUpdateInput) => {
  const response = await instance.put(`/products/${productId}`, data);
  return getSuccessResponse<ProductResponse>(response);
};

export const deleteProductRequest = async ({ productId }: ProductIdParam) => {
  const response = await instance.delete(`/products/${productId}`);
  return getSuccessResponse<null>(response);
};
