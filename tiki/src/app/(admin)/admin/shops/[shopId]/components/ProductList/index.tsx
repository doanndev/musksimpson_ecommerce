import { ProductQueryKey, useDeleteProductMutation, useProductsQuery } from '@/api/products/query';
import type { ProductFilterType } from '@/api/products/schema';
import type { ProductResponse } from '@/api/products/type';
import { queryClient } from '@/app/providers';
import ConfirmModal from '@/components/ui/admin/ConfirmModal';
import {
  ArrowForwardRounded as ArrowForwardRoundedIcon,
  CreateOutlined as CreateOutlinedIcon,
  DeleteOutlineOutlined as DeleteOutlineOutlinedIcon,
  RestartAlt as ResetIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';

interface ProductListProps {
  shopId: string;
  onEdit: (product: ProductResponse) => void;
}

export default function ProductList({ shopId, onEdit }: ProductListProps) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<ProductFilterType['sort_by']>('updated_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const {
    data: productsData,
    isLoading,
    error,
  } = useProductsQuery({
    shop_id: shopId,
    limit: rowsPerPage,
    offset: page * rowsPerPage,
    name: search,
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  const deleteMutation = useDeleteProductMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ProductQueryKey.PRODUCTS, shopId] });
      setOpenConfirm(false);
      setSelectedItems([]);
    },
    onError: (error) => {
      alert(error.message || 'Failed to delete products');
    },
  });

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedItems(products.map((product: ProductResponse) => product.uuid));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (productId: string) => {
    setSelectedItems((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleDelete = () => {
    setOpenConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (selectedItems.length > 0) {
      deleteMutation.mutate(selectedItems);
    }
  };

  const handleSort = (column: ProductFilterType['sort_by']) => {
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
    setSortBy('name');
    setSortOrder('asc');
  };

  const products = productsData?.items || [];
  const totalItems = productsData?.meta?.totalItem || 0;
  const showReset = search;

  return (
    <>
      <Paper elevation={3} sx={{ borderRadius: '24px', p: 3, bgcolor: 'white' }}>
        <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
          <Typography variant='h6' fontWeight='bold'>
            Products
          </Typography>
          <Button
            variant='contained'
            color='primary'
            href={`/products/create?shopId=${shopId}`}
            sx={{ borderRadius: '12px', bgcolor: 'blue.600', '&:hover': { bgcolor: 'blue.700' } }}
          >
            Create Product
          </Button>
        </Stack>

        <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
          <Stack direction='row' gap={1} alignItems='center'>
            <TextField
              label='Search'
              placeholder='Search products...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color='action' sx={{ mr: 1 }} />,
              }}
              size='small'
              sx={{ width: '250px', '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              variant='outlined'
            />
          </Stack>
          {showReset && (
            <IconButton onClick={handleReset} color='inherit'>
              <ResetIcon />
            </IconButton>
          )}
        </Box>

        {isLoading ? (
          <Stack alignItems='center' mt={5}>
            <Typography>Loading...</Typography>
          </Stack>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding='checkbox'>
                    <Checkbox
                      checked={selectedItems.length === products.length && products.length > 0}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  {selectedItems.length > 0 ? (
                    <>
                      <TableCell style={{ padding: '10px 12px' }}>
                        <Stack gap={1} direction='row' alignItems='center'>
                          <Typography mr={1}>Đã chọn {selectedItems.length}</Typography>
                          <Typography>|</Typography>
                          <IconButton color='inherit' onClick={handleDelete}>
                            <DeleteOutlineOutlinedIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                      <TableCell style={{ padding: 0 }} />
                      <TableCell style={{ padding: 0 }} />
                      <TableCell style={{ padding: 0 }} />
                      <TableCell style={{ padding: '10px 16px', textAlign: 'center' }} />
                    </>
                  ) : (
                    <>
                      <TableCell sx={{ fontWeight: 'bold' }}>
                        <TableSortLabel
                          active={sortBy === 'name'}
                          direction={sortBy === 'name' ? sortOrder : 'asc'}
                          onClick={() => handleSort('name')}
                        >
                          Name
                        </TableSortLabel>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>
                        <TableSortLabel
                          active={sortBy === 'price'}
                          direction={sortBy === 'price' ? sortOrder : 'asc'}
                          onClick={() => handleSort('price')}
                        >
                          Price
                        </TableSortLabel>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>
                        <TableSortLabel
                          active={sortBy === 'stock'}
                          direction={sortBy === 'stock' ? sortOrder : 'asc'}
                          onClick={() => handleSort('stock')}
                        >
                          Stock
                        </TableSortLabel>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.uuid} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                    <TableCell padding='checkbox'>
                      <Checkbox
                        checked={selectedItems.includes(product.uuid)}
                        onChange={() => handleSelectItem(product.uuid)}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction='row' alignItems='center' gap={2}>
                        <Avatar
                          src={product.images?.[0]?.url || '/default-product.png'}
                          sx={{ width: 40, height: 40, borderRadius: '8px' }}
                        />
                        <Link href={`/products/${product.uuid}`} className='text-blue-600 hover:underline'>
                          {product.name}
                        </Link>
                      </Stack>
                    </TableCell>
                    <TableCell>${product.new_price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <IconButton color='inherit' onClick={() => onEdit(product)}>
                        <CreateOutlinedIcon />
                      </IconButton>
                      <IconButton color='inherit' component={Link} href={`/products/${product.uuid}`}>
                        <ArrowForwardRoundedIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
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
          </>
        )}
      </Paper>

      <ConfirmModal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirmDelete}
        title='Delete Products'
        description={`Are you sure you want to delete ${selectedItems.length} product(s)? This action cannot be undone.`}
      />
    </>
  );
}
