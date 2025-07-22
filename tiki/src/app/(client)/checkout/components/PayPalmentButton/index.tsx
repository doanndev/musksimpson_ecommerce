'use client';

import { CartQueryKey } from '@/api/cart-items/query';
import { capturePaypalPaymentRequest, createPaypalPaymentRequest } from '@/api/payments/request';
import { queryClient } from '@/app/providers';
import { useAuth } from '@/hooks/useAuth';
import { env } from '@/lib/env';
import type { ProductCheckout } from '@/stores/checkoutStore';
import { useCheckoutStore } from '@/stores/checkoutStore';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useMutation } from '@tanstack/react-query';
import { convert } from 'html-to-text';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

interface CartItem {
  product_id: string;
  quantity: number;
  unit_price: number;
  name: string;
  image_url: string;
  url: string;
  category: string;
  sku: number;
}

interface PayPalmentButtonProps {
  cart: {
    items: ProductCheckout[];
    total_amount: number;
  };
}

const PayPalmentButton: React.FC<PayPalmentButtonProps> = ({ cart }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { clearCheckoutData } = useCheckoutStore();

  // Mutation for creating PayPal order
  const createOrderMutation = useMutation({
    mutationFn: async (data: { user_id: string; items: CartItem[]; amount: number }) => {
      const response = await createPaypalPaymentRequest(data);
      return response;
    },
    onSuccess: (response: any) => {
      console.log('response', response);
      return response.approvalUrl as string; // Return approvalUrl for PayPal
    },
    onError: (error: Error) => {
      toast.error('Tạo đơn hàng thất bại. Vui lòng thử lại.');
      console.error('Create order error:', error);
    },
  });

  // Mutation for capturing PayPal payment
  const captureOrderMutation = useMutation({
    mutationFn: async (paypalOrderId: string) => {
      console.log({ paypalOrderId });
      const response = await capturePaypalPaymentRequest(paypalOrderId);
      return response;
    },
    onSuccess: async () => {
      toast.success('Thanh toán thành công! Đơn hàng đang được xử lý.');
      clearCheckoutData();
      router.push('/orders');
    },
    onError: (error: Error) => {
      toast.error('Thanh toán thất bại. Vui lòng thử lại.');
      console.error('Capture order error:', error);
    },
  });

  const createOrder = async (data: any, actions: any) => {
    try {
      if (!user?.uuid) {
        throw new Error('User not authenticated');
      }

      const items = cart.items.map((item) => ({
        product_id: item.uuid,
        quantity: item.quantity,
        unit_price: item.new_price,
        description: convert(item.description || '')?.substring(0, 120) + '...' || '',
        name: item.name?.substring(0, 120) + '...' || '',
        image_url: item.images?.find((img) => img.is_primary)?.url || '',
        url: `${env.APP_URL}/product/${item.slug}/${item.uuid}`,
        category: item.category_id || '',
        sku: item.stock || 0,
        fee: item.fee ?? 0,
      }));

      if (!cart.total_amount) {
        throw new Error('Total amount is missing');
      }

      const data = await createOrderMutation.mutateAsync({
        user_id: user.uuid,
        items,
        amount: cart.total_amount,
      });

      console.log({ data });

      return data.payment.transaction_id;
    } catch (error: any) {
      console.error('Error in createOrder:', error);
      router.push(`/payment/failed?error=${encodeURIComponent(error.message)}&provider=PayPal`);
      throw error;
    }
  };

  const onApprove = async (data: any, actions: any) => {
    try {
      console.log({ data });
      await captureOrderMutation.mutateAsync(data.orderID);
      queryClient.invalidateQueries({ queryKey: [CartQueryKey.CART, user?.uuid] });
      queryClient.refetchQueries({ queryKey: [CartQueryKey.CART, user?.uuid] });
      router.push(`/payment/success?orderId=${data.orderID}&provider=PayPal`);
    } catch (error: any) {
      console.error('Error in onApprove:', error);
      router.push(`/payment/failed?error=${encodeURIComponent(error.message)}&provider=PayPal`);
      throw error;
    }
  };

  return (
    <div className='paypal-buttons-container'>
      <PayPalButtons
        disabled={createOrderMutation.isPending || captureOrderMutation.isPending}
        createOrder={(data, actions) => createOrder(data, actions)}
        onApprove={(data, actions) => onApprove(data, actions)}
        onCancel={() => {
          toast.info('Thanh toán đã bị hủy.');
          router.push('/cart');
        }}
        onError={(err) => {
          toast.error('Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.');
          console.error('PayPal Buttons error:', err);
        }}
      />
    </div>
  );
};

export default PayPalmentButton;
