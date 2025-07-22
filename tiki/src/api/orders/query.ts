import { onMutateError } from '@/lib/utils';
import type { PaginatedResponse } from '@/types';
import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  cancelOrderRequest,
  createOrderRequest,
  getOrderByIdRequest,
  getOrdersRequest,
  updateOrderStatusRequest,
} from './request';
import type { OrderCreateInput, OrderFilter, OrderResponse, OrderStatusUpdate, UuidParam } from './type';

export enum OrderQueryKey {
  ORDERS = 'orders',
  ORDER = 'order',
}

export const useOrdersQuery = (
  params: OrderFilter,
  options?: Omit<
    UseQueryOptions<
      PaginatedResponse<OrderResponse>['data'],
      Error,
      PaginatedResponse<OrderResponse>['data'],
      [OrderQueryKey.ORDERS, OrderFilter]
    >,
    'queryKey'
  >
) => {
  return useQuery({
    queryKey: [OrderQueryKey.ORDERS, params],
    queryFn: () => getOrdersRequest(params),
    ...options,
  });
};

export const useOrderByIdQuery = ({ uuid }: UuidParam) => {
  return useQuery({
    queryKey: [OrderQueryKey.ORDER, uuid],
    queryFn: () => getOrderByIdRequest({ uuid }),
    enabled: !!uuid,
  });
};

export const useCancelOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelOrderRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OrderQueryKey.ORDERS] });
    },
  });
};

export const useCreateOrderMutation = (options?: UseMutationOptions<OrderResponse, Error, OrderCreateInput, unknown>) =>
  useMutation({
    mutationFn: createOrderRequest,
    onError: onMutateError,
    ...options,
  });

export const useUpdateOrderStatusMutation = (
  options?: UseMutationOptions<OrderResponse, Error, { uuid: string; data: OrderStatusUpdate }, unknown>
) =>
  useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: OrderStatusUpdate }) =>
      updateOrderStatusRequest({ uuid, ...data }),
    onError: onMutateError,
    ...options,
  });
