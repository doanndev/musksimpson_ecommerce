'use client';

import React, { useState } from 'react';

import { OrderQueryKey, useOrdersQuery, useUpdateOrderStatusMutation } from '@/api/orders/query';
import { type OrderFilter, type OrderResponse, OrderStatusEnum } from '@/api/orders/type';
import { queryClient } from '@/app/providers';
import ExcelButton from '@/components/ui/admin/ExcelButton';
import { RoleEnum } from '@/lib/constants/role';
import { useAuthStore } from '@/stores/authStore';
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import dayjs from 'dayjs';
import ModalChangeStatus from './components/ModalChangeStatus';
import SearchBar from './components/SearchBar';

function OrderPage() {
  const { user } = useAuthStore();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{ orderId: string; status: OrderStatusEnum } | null>(
    null
  );
  const [filters, setFilters] = useState<OrderFilter>({
    search: '',
    status: null,
    limit: 10,
    offset: 0,
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  const { data, isLoading, refetch } = useOrdersQuery(filters);

  const orders = data?.items || [];
  const totalItems = data?.meta?.totalItem || 0;
  const showReset = !!filters.search || !!filters.status;

  const { mutate: updateOrderStatusMutation, isPending: isUpdateOrderStatusPending } = useUpdateOrderStatusMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OrderQueryKey.ORDERS] });
    },
  });

  const handleSort = (column: OrderFilter['sort_by']) => {
    const isAsc = filters.sort_by === column && filters.sort_order === 'asc';
    setFilters({ ...filters, sort_by: column, sort_order: isAsc ? 'desc' : 'asc' });
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setFilters({ ...filters, offset: newPage * (filters.limit || 10) });
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, limit: parseInt(event.target.value, 10), offset: 0 });
  };

  const handleStatusModalOpen = (orderId: string, status: OrderStatusEnum) => {
    setPendingStatusChange({ orderId, status });
    setOpenStatusModal(true);
  };

  const handleConfirmStatusChange = () => {
    if (pendingStatusChange && user?.roles === RoleEnum.ADMIN) {
      updateOrderStatusMutation({ uuid: pendingStatusChange.orderId, data: { status: pendingStatusChange.status } });
    }
    setOpenStatusModal(false);
    setPendingStatusChange(null);
  };

  const handleReset = () => {
    setFilters({ ...filters, search: '', status: null });
  };

  // Map orders data for Excel export
  const handleMapOrderData = (orders: OrderResponse[]) =>
    orders.map((order) => ({
      'Mã đơn': order.uuid,
      'Người đặt': order.user?.username || '',
      'Tổng tiền': order.total_amount.toLocaleString() + 'đ',
      'Trạng thái': order.status,
      'Ngày tạo': dayjs(order.created_at).format('DD/MM/YYYY'),
    }));

  return (
    <div className='pb-6'>
      <h1 className='mb-4 font-semibold text-2xl'>Quản lý đơn hàng</h1>
      <div className='rounded-2xl bg-white p-6'>
        <Stack justifyContent='space-between' direction='row'>
          <SearchBar
            filters={filters}
            setFilters={setFilters}
            showReset={showReset}
            onReset={() => setFilters({ ...filters, search: '', status: null })}
          />

          <Box className='mb-4 flex space-x-4'>
            {user?.roles === RoleEnum.ADMIN && (
              <ExcelButton
                mode='export'
                data={orders}
                mapDataForExport={handleMapOrderData}
                fileName='orders'
                sheetName='Orders'
                buttonText='Export Orders'
              />
            )}
          </Box>
        </Stack>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={filters.sort_by === 'uuid'}
                    direction={filters.sort_by === 'uuid' ? filters.sort_order : 'asc'}
                    onClick={() => handleSort('uuid')}
                  >
                    Mã đơn
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={filters.sort_by === 'user_id'}
                    direction={filters.sort_by === 'user_id' ? filters.sort_order : 'asc'}
                    onClick={() => handleSort('user_id')}
                  >
                    Người đặt
                  </TableSortLabel>
                </TableCell>
                <TableCell>Tổng tiền</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={filters.sort_by === 'created_at'}
                    direction={filters.sort_by === 'created_at' ? filters.sort_order : 'asc'}
                    onClick={() => handleSort('created_at')}
                  >
                    Ngày tạo
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.uuid} hover>
                  <TableCell>{order.uuid}</TableCell>
                  <TableCell>{order.user?.username}</TableCell>
                  <TableCell>{order.total_amount.toLocaleString()}đ</TableCell>
                  <TableCell>
                    <FormControl size='small' sx={{ m: 1, minWidth: 120 }}>
                      <Select
                        value={order.status}
                        onChange={(e) => handleStatusModalOpen(order.uuid, e.target.value as OrderStatusEnum)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        sx={{ borderRadius: 24 }}
                      >
                        <MenuItem value={OrderStatusEnum.PENDING}>PENDING</MenuItem>
                        <MenuItem value={OrderStatusEnum.PROCESSING}>PROCESSING</MenuItem>
                        <MenuItem value={OrderStatusEnum.SHIPPING}>SHIPPING</MenuItem>
                        <MenuItem value={OrderStatusEnum.DELIVERED}>DELIVERED</MenuItem>
                        <MenuItem value={OrderStatusEnum.CANCELLED}>CANCELLED</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>{dayjs(order.created_at).format('DD/MM/YYYY')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component='div'
          count={totalItems}
          page={filters.offset ? filters.offset / (filters.limit || 10) : 0}
          rowsPerPage={filters.limit || 10}
          rowsPerPageOptions={[5, 10, 25]}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          sx={{ borderTop: '1px solid #e2e8f0' }}
        />
      </div>

      <ModalChangeStatus
        open={openStatusModal}
        onClose={() => setOpenStatusModal(false)}
        onConfirm={handleConfirmStatusChange}
        status={pendingStatusChange?.status}
        isLoading={isUpdateOrderStatusPending}
      />
    </div>
  );
}

export default OrderPage;
