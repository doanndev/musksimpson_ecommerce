import instance, { getSuccessResponse } from '../axios';
import type {
  CartItemCreateInputType,
  CartItemIdType,
  CartItemParamsType,
  CartItemResponseType,
  CartItemUpdateInputType,
} from './type';

export const getCartItemsByUserRequest = async ({ user_id }: CartItemParamsType) => {
  const response = await instance.get(`/cart-items/user/${user_id}`);
  return getSuccessResponse<CartItemResponseType[]>(response);
};

export const getAdminCartItemsByUserRequest = async ({ user_id }: CartItemParamsType) => {
  const response = await instance.get(`/cart-items/admin/user/${user_id}`);
  return getSuccessResponse<CartItemResponseType[]>(response);
};

export const addCartItemRequest = async (data: CartItemCreateInputType) => {
  const response = await instance.post('/cart-items', data);
  return getSuccessResponse<CartItemResponseType>(response);
};

export const updateCartItemRequest = async ({ id, ...data }: CartItemIdType & CartItemUpdateInputType) => {
  const response = await instance.put(`/cart-items/${id}`, data);
  return getSuccessResponse<CartItemResponseType>(response);
};

export const deleteCartItemRequest = async ({ id }: CartItemIdType) => {
  const response = await instance.delete(`/cart-items/${id}`);
  return getSuccessResponse<null>(response);
};
