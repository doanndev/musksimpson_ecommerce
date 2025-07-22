import { OrderStatusEnum } from '@/api/orders/type';

export const getStatusColor = (status?: OrderStatusEnum): string => {
  if (!status) return '#9E9E9E';
  switch (status) {
    case OrderStatusEnum.DELIVERED:
      return '#00FF00';
    case OrderStatusEnum.CANCELLED:
      return '#FF0000';
    case OrderStatusEnum.SHIPPING:
      return '#0000FF';
    case OrderStatusEnum.PENDING:
      return '#FFC107';
    default:
      return '#9E9E9E';
  }
};
