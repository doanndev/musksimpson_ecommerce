'use client';

import { ROUTES } from '@/lib/routes';
import { Error as ErrorIcon } from '@mui/icons-material';
import { Button, Card, CardContent, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

const PaymentFailedPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'An unknown error occurred';
  const provider = searchParams.get('provider') || 'Payment';

  return (
    <Container maxWidth='sm' className='flex min-h-screen items-center justify-center py-8'>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className='!rounded-2xl !shadow-none overflow-hidden bg-white'>
          <CardContent className='p-8 text-center'>
            <ErrorIcon className='!mb-4 !text-6xl text-red-500' />
            <Typography variant='h4' className='!mb-4 font-bold text-gray-800'>
              {provider} thất bại!
            </Typography>
            <Typography variant='body1' className='!mb-6 px-6 text-gray-600'>
              Chúng tôi không thể xử lý thanh toán của bạn. {error}.
            </Typography>
            <Typography variant='body2' className='!mb-4 px-6 text-gray-500'>
              Vui lòng thử lại hoặc liên hệ với chúng tôi nếu vấn đề vẫn tồn tại.
            </Typography>
            <div className='flex justify-center gap-4'>
              <Button
                variant='contained'
                color='primary'
                onClick={() => router.push(ROUTES.CART)}
                className='rounded-full px-6'
              >
                Thử lại
              </Button>
              <Button
                variant='outlined'
                color='primary'
                onClick={() => router.push('/support')}
                className='rounded-full px-6'
              >
                Liên hệ với chúng tôi
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
};

export default PaymentFailedPage;
