'use client';

import { ShopQueryKey, useShopsQuery } from '@/api/shop/query';
import { deleteShopRequest } from '@/api/shop/request';
import { queryClient } from '@/app/providers';
import ConfirmModal from '@/components/ui/admin/ConfirmModal';
import { ROUTES } from '@/lib/routes';
import { useAuthStore } from '@/stores/authStore';
import { Button, CircularProgress, Stack, Table, TablePagination, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';
import SearchBar from './components/SearchBar';
import TableContent from './components/TableContent';
import TableHeader from './components/TableHeader';

export default function ShopsPage() {
  const { user } = useAuthStore();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const {
    data: shopsData,
    isLoading,
    error,
  } = useShopsQuery({
    seller_id: user?.uuid,
    limit: rowsPerPage,
    offset: page * rowsPerPage,
    name: search,
    is_active: filterStatus === 'ACTIVE',
    sort_by: sortBy as 'name' | 'is_active',
    sort_order: sortOrder,
  });

  const deleteMutation = useMutation({
    mutationFn: (shopIds: string[]) => Promise.all(shopIds.map((id) => deleteShopRequest(id))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ShopQueryKey.SHOPS] });
      setOpenConfirm(false);
      setSelectedItems([]);
    },
    onError: (error) => {
      alert(error.message || 'Failed to delete shops');
    },
  });

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedItems(shopsData?.items?.map((shop: any) => shop.uuid) || []);
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (shopId: string) => {
    setSelectedItems((prev) => (prev.includes(shopId) ? prev.filter((id) => id !== shopId) : [...prev, shopId]));
  };

  const handleDelete = () => {
    setOpenConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (selectedItems.length > 0) {
      deleteMutation.mutate(selectedItems);
    }
  };

  const handleSort = (column: string) => {
    const isAsc = sortBy === column && sortOrder === 'asc';
    setSortBy(column);
    setSortOrder(isAsc ? 'desc' : 'asc');
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleReset = () => {
    setSearch('');
    setFilterStatus('');
    setSortBy('name');
    setSortOrder('asc');
  };

  const shops = shopsData?.items || [];
  const totalItems = shopsData?.meta?.totalItem || 0;
  const showReset = !!search || !!filterStatus;

  return (
    <div>
      <Stack direction='row' justifyContent='space-between' alignItems='center' className='!my-6'>
        <Typography variant='h4' fontWeight='bold'>
          Manage Shops
        </Typography>
        <Button
          variant='contained'
          color='primary'
          component={Link}
          href={ROUTES.ADMIN_SHOPS_CREATE}
          sx={{ borderRadius: '12px', bgcolor: 'blue.600', '&:hover': { bgcolor: 'blue.700' } }}
        >
          Create Shop
        </Button>
      </Stack>

      {isLoading ? (
        <Stack alignItems='center' mt={5}>
          <CircularProgress />
        </Stack>
      ) : error ? (
        <Typography color='error' align='center' mt={5}>
          Error loading shops: {(error as any).message}
        </Typography>
      ) : (
        <div className='rounded-2xl bg-white p-6'>
          <SearchBar
            search={search}
            setSearch={setSearch}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            showReset={showReset}
            onReset={handleReset}
          />
          <Table>
            <TableHeader
              selectedItems={selectedItems}
              shops={shops}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSelectAll={handleSelectAll}
              onSort={handleSort}
              onDelete={handleDelete}
            />
            <TableContent shops={shops} selectedItems={selectedItems} onSelectItem={handleSelectItem} />
          </Table>
          <TablePagination
            component='div'
            count={totalItems}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            sx={{ borderTop: '1px solid #e2e8f0' }}
          />
        </div>
      )}

      <ConfirmModal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirmDelete}
        title='Delete Shops'
        description={`Are you sure you want to delete ${selectedItems.length} shop(s)? This action cannot be undone.`}
      />
    </div>
  );
}
