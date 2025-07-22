'use client';

import type { OrderResponse } from '@/api/orders/type';
import { Search as SearchIcon } from '@mui/icons-material';
import {
  Box,
  Card,
  Checkbox,
  Chip,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';

interface OrderTableProps {
  orders: OrderResponse[];
  page: number;
  rowsPerPage: number;
  totalItems: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  page,
  rowsPerPage,
  totalItems,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<keyof OrderResponse>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleSort = (column: keyof OrderResponse) => {
    const isAsc = sortBy === column && sortOrder === 'asc';
    setSortBy(column);
    setSortOrder(isAsc ? 'desc' : 'asc');
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedItems(orders.map((order) => order.uuid));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (uuid: string) => {
    setSelectedItems((prev) => (prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid]));
  };

  const getStatusColor = (status: string): 'success' | 'error' | 'warning' | 'info' | 'default' => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
        return 'success'; // xanh lá
      case 'CANCELLED':
        return 'error'; // đỏ
      case 'SHIPPED':
        return 'info'; // xanh dương
      case 'PENDING':
        return 'warning'; // vàng
      default:
        return 'default'; // xám
    }
  };

  return (
    <Card sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#fff' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0' }}>
        <TextField
          placeholder='Tìm kiếm theo mã đơn hoặc trạng thái'
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
        />
      </Box>

      <Box sx={{ minWidth: 800 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(0, 0, 0, 0.045)' }}>
                <TableCell padding='checkbox'>
                  <Checkbox
                    checked={selectedItems.length === orders.length && orders.length > 0}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'uuid'}
                    direction={sortBy === 'uuid' ? sortOrder : 'asc'}
                    onClick={() => handleSort('uuid')}
                  >
                    Mã đơn
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'uuid'}
                    direction={sortBy === 'uuid' ? sortOrder : 'asc'}
                    onClick={() => handleSort('uuid')}
                  >
                    Người đặt
                  </TableSortLabel>
                </TableCell>
                <TableCell>Tổng tiền</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'created_at'}
                    direction={sortBy === 'created_at' ? sortOrder : 'asc'}
                    onClick={() => handleSort('created_at')}
                  >
                    Ngày tạo
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.uuid} hover selected={selectedItems.includes(order.uuid)}>
                  <TableCell padding='checkbox'>
                    <Checkbox
                      checked={selectedItems.includes(order.uuid)}
                      onChange={() => handleSelectItem(order.uuid)}
                    />
                  </TableCell>
                  <TableCell>{order.uuid}</TableCell>
                  <TableCell>{order.user?.username}</TableCell>
                  <TableCell>{order.total_amount.toLocaleString()}đ</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      variant='outlined'
                      size='small'
                      sx={{ fontWeight: 'bold' }}
                    />
                  </TableCell>

                  <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component='div'
          count={totalItems}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          sx={{ borderTop: '1px solid #e2e8f0' }}
        />
      </Box>
    </Card>
  );
};

export default OrderTable;
