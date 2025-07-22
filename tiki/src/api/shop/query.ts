import { type UseMutationOptions, useMutation, useQuery } from '@tanstack/react-query';
import {
  createShopRequest,
  deleteShopRequest,
  getAllShopRequest,
  getByIdShopRequest,
  updateShopRequest,
} from './request';
import type { ShopCreateInputType, ShopFilterType, ShopResponseType, ShopUpdateInputType } from './type';

export const enum ShopQueryKey {
  SHOPS = 'shops',
}

export const useShopsQuery = (params: ShopFilterType) =>
  useQuery({
    queryKey: [ShopQueryKey.SHOPS, params],
    queryFn: () => getAllShopRequest(params),
  });

export const useShopByIdQuery = (shopId: string) =>
  useQuery({
    queryKey: [ShopQueryKey.SHOPS, shopId],
    queryFn: () => getByIdShopRequest(shopId),
  });

export const useCreateShopMutation = (
  options?: UseMutationOptions<ShopResponseType, Error, ShopCreateInputType, unknown>
) =>
  useMutation({
    mutationFn: (params: ShopCreateInputType) => createShopRequest(params),
    ...options,
  });

export const useUpdateShopMutation = (
  options?: UseMutationOptions<ShopResponseType, Error, { shopId: string; data: ShopUpdateInputType }, unknown>
) =>
  useMutation({
    mutationFn: ({ shopId, data }: { shopId: string; data: ShopUpdateInputType }) =>
      updateShopRequest({ shopId, data }),
    ...options,
  });

export const useDeleteShopMutation = (options?: UseMutationOptions<ShopResponseType[], Error, string[], unknown>) =>
  useMutation({
    mutationFn: (shopIds: string[]) => Promise.all(shopIds.map((id) => deleteShopRequest(id))),
    ...options,
  });
