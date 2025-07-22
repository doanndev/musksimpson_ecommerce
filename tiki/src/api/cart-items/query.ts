import { type UseMutationOptions, useMutation, useQuery } from '@tanstack/react-query';
import { deleteCartItemRequest, getAdminCartItemsByUserRequest, getCartItemsByUserRequest } from './request';
import type { CartItemIdType, CartItemParamsType } from './type';

export const CartQueryKey = {
  CART: 'cart',
  ADMIN_CART: 'admin-cart',
};

export const useCartItems = ({ user_id }: CartItemParamsType) => {
  return useQuery({
    queryKey: [CartQueryKey.CART, user_id],
    queryFn: () => getCartItemsByUserRequest({ user_id }),
    enabled: !!user_id,
    staleTime: 0,
  });
};

export const useAdminCartItems = ({ user_id }: CartItemParamsType) => {
  return useQuery({
    queryKey: [CartQueryKey.ADMIN_CART, user_id],
    queryFn: () => getAdminCartItemsByUserRequest({ user_id }),
    enabled: !!user_id,
    staleTime: 0,
  });
};

export const useDeleteCartItemMutation = (options?: UseMutationOptions<null, unknown, CartItemIdType>) => {
  return useMutation({
    mutationFn: deleteCartItemRequest,
    ...options,
  });
};
