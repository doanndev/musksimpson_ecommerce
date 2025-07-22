import instance, { getPaginatedResponse, getSuccessResponse } from '../axios';
import type { ShopCreateInputType, ShopFilterType, ShopResponseType, ShopUpdateInputType } from './type';

export const getAllShopRequest = async (params: ShopFilterType) => {
  const response = await instance.get(`/shops`, { params });
  return getPaginatedResponse<ShopResponseType>(response);
};
export const getByIdShopRequest = async (shopId: string) => {
  const response = await instance.get(`/shops/${shopId}`);
  return getSuccessResponse<ShopResponseType>(response);
};
export const createShopRequest = async (data: ShopCreateInputType) => {
  const response = await instance.post(`/shops`, data);
  return getSuccessResponse<ShopResponseType>(response);
};
export const updateShopRequest = async ({ shopId, data }: { shopId: string; data: ShopUpdateInputType }) => {
  const response = await instance.put(`/shops/${shopId}`, data);
  return getSuccessResponse<ShopResponseType>(response);
};

export const deleteShopRequest = async (shopId: string) => {
  const response = await instance.delete(`/shops/${shopId}`);
  return getSuccessResponse<ShopResponseType>(response);
};
