'use client';

import { ROUTES } from '@/lib/routes';
import { CheckCircle } from '@mui/icons-material';
import { Button, Card, CardContent, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

const PaymentSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const provider = searchParams.get('provider') || 'Payment';

  const getProviderName = () => {
    switch (provider) {
      case 'PayPal':
        return 'Thanh toán qua PayPal';
      case 'COD':
        return 'Thanh toán khi nhận hàng';
      default:
        return 'Thanh toán';
    }
  };

  return (
    <Container maxWidth='sm' className='flex min-h-screen items-center justify-center py-8'>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className='!rounded-2xl !shadow-none overflow-hidden bg-white'>
          <CardContent className='p-8 text-center'>
            <CheckCircle className='!mb-4 !text-6xl text-green-500' />
            <Typography variant='h4' className='!mb-4 font-bold text-gray-800'>
              {getProviderName()} thành công!
            </Typography>
            <Typography variant='body1' className='!mb-6 px-6 text-gray-600'>
              Cảm ơn bạn đã mua hàng. Đơn hàng {orderId ? `#${orderId.substring(0, 6)}` : ''} đang được xử lý. Bạn sẽ
              nhận được email xác nhận sớm.
            </Typography>
            {orderId && (
              <Typography variant='body2' className='!mb-4 text-gray-500'>
                Mã đơn hàng: {orderId.substring(0, 6)}
              </Typography>
            )}
            <div className='flex justify-center gap-4'>
              <Button
                variant='contained'
                color='primary'
                onClick={() => router.push(ROUTES.ACCOUNT_ORDERS)}
                className='rounded-full px-6'
              >
                Xem đơn hàng
              </Button>
              <Button
                variant='outlined'
                color='primary'
                onClick={() => router.push(ROUTES.HOME)}
                className='rounded-full px-6'
              >
                Quay lại trang chủ
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
};

export default PaymentSuccessPage;
