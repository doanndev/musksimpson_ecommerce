'use client';

import { OrderQueryKey, useOrdersQuery, useUpdateOrderStatusMutation } from '@/api/orders/query';
import { OrderStatusEnum } from '@/api/orders/type';
import { queryClient } from '@/app/providers';
import { HStack } from '@/components/utils/h-stack';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/lib/routes';
import { getStatusColor, getStatusLabel } from '@/lib/utils';
import { Cancel as CancelIcon, Search as SearchIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  InputAdornment,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import socketService from '../../../../lib/socketService';
import ModalChangeStatus from './components/ModalChangeStatus';

const OrdersPage = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  const tabs = [
    { label: 'Tất cả đơn', status: undefined },
    { label: 'Chờ xác nhận', status: OrderStatusEnum.PENDING },
    { label: 'Đang xử lý', status: OrderStatusEnum.PROCESSING },
    { label: 'Đang vận chuyển', status: OrderStatusEnum.SHIPPING },
    { label: 'Đã giao', status: OrderStatusEnum.DELIVERED },
    { label: 'Đã huỷ', status: OrderStatusEnum.CANCELLED },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: ordersResponse,
    isLoading,
    refetch,
  } = useOrdersQuery({
    user_id: user?.uuid,
    status: tabs[selectedTab].status,
    search: debouncedSearch,
    limit: rowsPerPage,
    offset: page * rowsPerPage,
  });

  const orders = ordersResponse?.items || [];
  const total = ordersResponse?.meta?.totalItem || 0;

  // Cancel order mutation
  const cancelMutation = useUpdateOrderStatusMutation({
    onSuccess: () => {
      toast.success('Đơn hàng đã được huỷ thành công.');
      setOpenConfirm(false);
      setPage(0);
      refetch();
      queryClient.invalidateQueries({ queryKey: [OrderQueryKey.ORDERS] });
    },
    onError: (error: any) => {
      toast.error(`Không thể huỷ đơn hàng: ${error.message}`);
    },
  });
  useEffect(() => {
    const handleOrderUpdated = (msg: string) => {
      refetch();
      toast.success('Đơn hàng của bạn đã được cập nhật');
    };

    socketService.on('orderUpdated', handleOrderUpdated);

    return () => {
      socketService.off('orderUpdated', handleOrderUpdated);
    };
  }, [refetch]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    setPage(0); // Reset page when tab changes
  };

  const handleViewDetails = (orderId: string) => {
    router.push(`${ROUTES.ACCOUNT_ORDERS}/${orderId}`);
  };

  const handleCancelOrder = (orderId: string) => {
    setOpenConfirm(true);
    setOrderId(orderId);
  };

  const handleConfirm = () => {
    cancelMutation.mutate({ uuid: orderId, data: { status: OrderStatusEnum.CANCELLED } });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth='lg' className='py-8'>
      <Typography variant='h5' fontWeight={500} className='!mb-6 !font-semibold text-gray-800'>
        Đơn hàng của tôi
      </Typography>

      <Box className='mb-6'>
        <TextField
          fullWidth
          size='small'
          placeholder='Tìm kiếm theo tên sản phẩm hoặc mã đơn hàng...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon className='text-gray-500' />
              </InputAdornment>
            ),
          }}
          variant='outlined'
          className='[&_.MuiInputBase-root]:!rounded-xl'
        />
      </Box>

      {/* Tabs */}
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant='scrollable'
        scrollButtons='auto'
        className='mb-6 border-gray-200 border-b'
      >
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.label} className='font-medium text-gray-700' />
        ))}
      </Tabs>

      {/* Orders Table */}
      {isLoading ? (
        <Box className='flex justify-center py-8'>
          <CircularProgress />
        </Box>
      ) : orders.length === 0 ? (
        <Box className='py-12 text-center'>
          <Typography variant='h6' className='text-gray-500'>
            Chưa có đơn hàng
          </Typography>
        </Box>
      ) : (
        <div className='overflow-hidden rounded-2xl bg-white'>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className='font-bold text-gray-700'>Hình ảnh</TableCell>
                <TableCell className='font-bold text-gray-700'>Mô tả</TableCell>
                <TableCell className='!text-center font-bold text-gray-700'>Số lượng</TableCell>
                <TableCell className='!text-right font-bold text-gray-700'>Giá</TableCell>
                <TableCell className='!text-right font-bold text-gray-700'>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) =>
                order.items?.map((item, index: number) => (
                  <>
                    <TableRow key={`${order.uuid}-${index}`} className='mt-2 hover:bg-gray-50'>
                      <TableCell className='min-w-[100px]'>
                        <img
                          src={item.product?.images?.find((img) => img.is_primary)?.url || '/placeholder-image.jpg'}
                          alt={item.product?.name || ''}
                          width={80}
                          height={80}
                          className='rounded-lg object-cover'
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2' className='line-clamp-2 font-medium text-gray-800'>
                          {item.product?.name}
                        </Typography>
                      </TableCell>
                      <TableCell className='min-w-[130px]'>
                        <Typography variant='body2' className='!text-center text-gray-800'>
                          {item.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell className='!text-right min-w-[200px]'>
                        <Typography variant='body2' className='text-gray-800'>
                          {item.unit_price.toLocaleString('vi-VN')} ₫
                        </Typography>
                      </TableCell>
                      <TableCell className='!text-right min-w-[200px]'>
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
                      </TableCell>
                    </TableRow>
                    <TableRow key={`${order.uuid}-${index}-action`}>
                      <TableCell colSpan={5} className='p-2'>
                        <HStack justify='between'>
                          <HStack spacing={8} className='mb-2'>
                            <Typography variant='h6' className='!font-medium text-gray-800'>
                              Tổng giá:
                            </Typography>
                            <Typography variant='h6' className='text-gray-800'>
                              {(item.unit_price * item.quantity).toLocaleString('vi-VN')} ₫
                            </Typography>
                          </HStack>
                          <Box className='flex justify-end gap-2'>
                            <Button
                              variant='outlined'
                              color='primary'
                              size='small'
                              startIcon={<VisibilityIcon />}
                              onClick={() => handleViewDetails(order.uuid)}
                              className='rounded-full'
                            >
                              Xem chi tiết
                            </Button>
                            {order.status === OrderStatusEnum.PENDING && (
                              <Button
                                variant='outlined'
                                color='error'
                                size='small'
                                startIcon={<CancelIcon />}
                                onClick={() => handleCancelOrder(order.uuid)}
                                disabled={cancelMutation.isPending}
                                className='rounded-full'
                              >
                                Huỷ bỏ
                              </Button>
                            )}
                          </Box>
                        </HStack>
                      </TableCell>
                    </TableRow>
                  </>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage='Hàng trên trang'
          />
        </div>
      )}

      <ModalChangeStatus
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirm}
        status={OrderStatusEnum.CANCELLED}
        isLoading={cancelMutation.isPending}
      />
    </Container>
  );
};

export default OrdersPage;
