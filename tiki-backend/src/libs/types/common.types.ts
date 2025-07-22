import type { Request } from 'express';
import type { PaginationType } from '../schemas/common.shema';

export interface AuthRequest extends Request {
  user?: { userId: string | null; roleId: number | null };
}

export interface IPagination<T> {
  items: T[];
  meta: PaginationType;
}

export enum OrderStatus {
  IN_CART = 'in cart',
  NEW_ORDERS = 'new orders',
  VERIFIED = 'verified',
  DELIVERING = 'delivering',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  DENIED = 'denied',
}
