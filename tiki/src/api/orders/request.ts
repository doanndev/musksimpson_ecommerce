import instance, { getPaginatedResponse, getSuccessResponse } from '../axios';
import type { OrderCreateInput, OrderFilter, OrderResponse, OrderStatusUpdate, UuidParam } from './type';

export const getOrdersRequest = async (params?: OrderFilter) => {
  const response = await instance.get(`/orders`, { params });
  return getPaginatedResponse<OrderResponse>(response);
};

export const createOrderRequest = async (data: OrderCreateInput) => {
  const response = await instance.post('/orders', data);
  return getSuccessResponse<OrderResponse>(response);
};

export const getOrderByIdRequest = async ({ uuid }: UuidParam) => {
  const response = await instance.get(`/orders/${uuid}`);
  return getSuccessResponse<OrderResponse>(response);
};

export const updateOrderStatusRequest = async ({ uuid, ...data }: UuidParam & OrderStatusUpdate) => {
  const response = await instance.put(`/orders/${uuid}/status`, data);
  return getSuccessResponse<OrderResponse>(response);
};

export const cancelOrderRequest = async ({ uuid }: UuidParam) => {
  const response = await instance.post(`/orders/${uuid}/cancel`);
  return getSuccessResponse<void>(response);
};
