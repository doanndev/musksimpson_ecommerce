import type { order_items, orders, products, users } from 'prisma/generated/client';
import type { PaginationResponse } from './user.types';

export interface Order extends orders {
  user?: users | null;
  order_items?: order_items[];
}

export interface OrderDetail extends order_items {
  product?: products | null;
}

export interface OrderFilter {
  sortByName?: 'asc' | 'desc';
  sortByDate?: 'newest' | 'oldest';
  limit?: number;
  offset?: number;
}

export interface OrderCreateInput {
  userId: string;
  totalPrice: number;
  status: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderUpdateInput {
  orderId: number;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status?: string;
}

export interface OrderResponseType {
  id: number;
  userId: string;
  username?: string;
  email?: string;
  avatar?: string;
  totalPrice: number;
  status: string;
  orderTime: Date;
  createdAt: Date;
  updatedAt: Date;
  orderDetails?: OrderDetailResponseType[];
}

export interface OrderDetailResponseType {
  id: number;
  orderId: number;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  thumbnailUrl?: string;
  shopName?: string;
}

export interface CartItemResponseType {
  id: number;
  orderId: number;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  thumbnailUrl: string;
  shopName: string;
  totalPriceAll: number;
}

export interface OrderPaginatedResponse {
  pagination: PaginationResponse;
  orders: OrderResponseType[];
}

export enum OrderStatusEnum {
  ALL = '',
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}
