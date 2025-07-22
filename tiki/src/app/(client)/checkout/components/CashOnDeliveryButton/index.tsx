'use client';

import type { AddressResponse } from '@/api/addresses/type';
import { CartQueryKey, useDeleteCartItemMutation } from '@/api/cart-items/query';
import { useCreateOrderMutation } from '@/api/orders/query';
import { queryClient } from '@/app/providers';
import { useAuth } from '@/hooks/useAuth';
import { onMutateError } from '@/lib/utils';
import { type ProductCheckout, useCheckoutStore } from '@/stores/checkoutStore';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

interface CashOnDeliveryButtonProps {
  cart: {
    items: ProductCheckout[];
    total_amount: number;
  };
  address: AddressResponse | null;
}

const CashOnDeliveryButton: React.FC<CashOnDeliveryButtonProps> = ({ cart, address }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { clearCheckoutData } = useCheckoutStore();
  const { mutateAsync: deleteCartItem } = useDeleteCartItemMutation({
    onError: onMutateError,
  });

  const { mutateAsync: createOrderMutation, isPending } = useCreateOrderMutation({
    onSuccess: async (response) => {
      try {
        if (cart.items.every((item) => item.cartId)) {
          await Promise.all(cart.items.map((item) => deleteCartItem({ id: item.cartId! })));
        }

        toast.success('Đặt hàng thành công! Đơn hàng đang chờ xác nhận.');
        clearCheckoutData();
        queryClient.invalidateQueries({ queryKey: [CartQueryKey.CART, user?.uuid] });
        queryClient.refetchQueries({ queryKey: [CartQueryKey.CART, user?.uuid] });
        router.push(`/payment/success?orderId=${response.uuid}&provider=COD`);
      } catch (error: any) {
        toast.error('Đặt hàng thành công nhưng không thể xóa giỏ hàng. Vui lòng kiểm tra giỏ hàng.');
        console.error('Error deleting cart items:', error);
      }
    },
    onError: (error: Error) => {
      toast.error('Đặt hàng thất bại. Vui lòng thử lại.');
      console.error('Create COD order error:', error);
      router.push(`/payment/failed?error=${encodeURIComponent(error.message)}&provider=COD`);
    },
  });

  const handlePlaceOrder = async () => {
    try {
      if (!user?.uuid) {
        toast.error('Khách hàng chưa đăng nhập');
        return;
      }

      if (!address?.id) {
        toast.error('Khách hàng chưa chọn địa chỉ');
        return;
      }

      if (!cart.total_amount) {
        toast.error('Tổng tiền không hợp lệ');
        return;
      }

      const items = cart.items.map((item) => ({
        product_id: item.uuid,
        quantity: item.quantity,
        unit_price: item.new_price,
      }));

      await createOrderMutation({
        user_id: user.uuid,
        items,
        address_id: address.id,
      });
    } catch (error: any) {
      toast.error(error.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
      console.error('Error in handlePlaceOrder:', error);
    }
  };

  return (
    <div>
      <Button
        variant='contained'
        color='error'
        className='checkout__order-price-btn'
        disabled={isPending || cart.items.length === 0}
        onClick={handlePlaceOrder}
      >
        Đặt hàng
      </Button>
    </div>
  );
};

export default CashOnDeliveryButton;
