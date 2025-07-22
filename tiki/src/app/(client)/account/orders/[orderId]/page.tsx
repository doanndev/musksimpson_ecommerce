'use client';

import { useOrderByIdQuery } from '@/api/orders/query';
import { ROUTES } from '@/lib/routes';
import { getStatusColor, getStatusLabel } from '@/lib/utils';
import {
  Button,
  Chip,
  CircularProgress,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';

const OrderDetailsPage = () => {
  const router = useRouter();
  const params = useParams<{ orderId: string }>();
  const { data: order, isLoading, error } = useOrderByIdQuery({ uuid: params.orderId });

  if (isLoading) {
    return (
      <Container className='py-8'>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !order) {
    router.push('/orders');
    return null;
  }

  return (
    <Container maxWidth='lg' className='py-8'>
      <Typography variant='h5' className='!mb-6 font-bold text-gray-800'>
        Chi tiết đơn hàng #{order.uuid}
      </Typography>
      <div className='rounded-2xl bg-white p-6'>
        <div className='pl-3'>
          <Typography variant='body1' className='!mb-4'>
            <strong>Trạng thái:</strong>{' '}
            <Chip
              size='small'
              label={getStatusLabel(order.status)}
              sx={{
                color: getStatusColor(order.status),
                backgroundColor: getStatusColor(order.status) + '20',
                border: `1px solid ${getStatusColor(order.status)}`,
              }}
              variant='outlined'
            />
          </Typography>
          <Typography variant='body1' className='!mb-4'>
            <strong>Ngày đặt:</strong> {new Date(order.created_at).toLocaleDateString('vi-VN')}
          </Typography>
          <Typography variant='body1' className='!mb-4'>
            <strong>Tổng tiền:</strong> {order.total_amount.toLocaleString('vi-VN')} ₫
          </Typography>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className='min-w-[200px] font-bold text-gray-700'>Hình ảnh</TableCell>
              <TableCell className='font-bold text-gray-700'>Sản phẩm</TableCell>
              <TableCell className='min-w-[150px] font-bold text-gray-700'>Số lượng</TableCell>
              <TableCell className='min-w-[150px] font-bold text-gray-700'>Đơn giá</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order?.items?.map((item, index: number) => (
              <TableRow key={index}>
                <TableCell>
                  <img
                    src={item.product?.images?.find((img) => img.is_primary)?.url || '/placeholder-image.jpg'}
                    alt={item.product?.name || ''}
                    width={60}
                    height={60}
                    className='rounded-lg object-cover'
                  />
                </TableCell>
                <TableCell>
                  <p className='line-clamp-2'>{item?.product?.name}</p>
                </TableCell>
                <TableCell className='min-w-[150px]'>{item?.quantity}</TableCell>
                <TableCell className='min-w-[150px]'>{item?.unit_price?.toLocaleString('vi-VN')} ₫</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button
          variant='outlined'
          color='primary'
          onClick={() => router.push(ROUTES.ACCOUNT_ORDERS)}
          className='!mt-4 rounded-full'
        >
          Quay lại
        </Button>
      </div>
    </Container>
  );
};

export default OrderDetailsPage;
