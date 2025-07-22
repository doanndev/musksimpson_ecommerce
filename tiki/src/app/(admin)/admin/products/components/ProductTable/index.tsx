'use client';

import {
  DeleteOutlineOutlined as DeleteIcon,
  CreateOutlined as EditIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  IconButton,
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

interface Product {
  uuid: string;
  name: string;
  image: string;
  old_price: number;
  new_price: number;
  discount_percentage: number;
  stock: number;
  sold: number;
  shop_name: string;
  is_deleted: boolean;
  updated_at: string;
}

interface ProductTableProps {
  products: Product[] | any[];
  page: number;
  rowsPerPage: number;
  totalItems: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: (id: string) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  page,
  rowsPerPage,
  totalItems,
  onPageChange,
  onDelete,
  onRowsPerPageChange,
}) => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<keyof Product>('updated_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedItems(e.target.checked ? products.map((p) => p.uuid) : []);
  };

  const handleSelectItem = (uuid: string) => {
    setSelectedItems((prev) => (prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid]));
  };

  const handleSort = (column: keyof Product) => {
    const isAsc = sortBy === column && sortOrder === 'asc';
    setSortBy(column);
    setSortOrder(isAsc ? 'desc' : 'asc');
  };

  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aVal = a[sortBy] || '';
    const bVal = b[sortBy] || '';
    return sortOrder === 'asc' ? (aVal < bVal ? -1 : 1) : aVal > bVal ? -1 : 1;
  });

  return (
    <Card sx={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}>
      <Box sx={{ p: 2 }}>
        <TextField
          placeholder='Search product name...'
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.04)' }}>
              <TableCell padding='checkbox'>
                <Checkbox
                  checked={selectedItems.length === products.length && products.length > 0}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Ảnh</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'name'}
                  direction={sortBy === 'name' ? sortOrder : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  Tên sản phẩm
                </TableSortLabel>
              </TableCell>
              <TableCell>Giá cũ</TableCell>
              <TableCell>Giá mới</TableCell>
              <TableCell>Giảm (%)</TableCell>
              <TableCell>Kho</TableCell>
              <TableCell>Đã bán</TableCell>
              <TableCell>Shop</TableCell>
              <TableCell>Chức năng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedProducts.map((product) => (
              <TableRow key={product.uuid} hover>
                <TableCell padding='checkbox'>
                  <Checkbox
                    checked={selectedItems.includes(product.uuid)}
                    onChange={() => handleSelectItem(product.uuid)}
                  />
                </TableCell>
                <TableCell>
                  <Avatar src={product.image} variant='rounded' />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.old_price.toLocaleString()}</TableCell>
                <TableCell>{product.new_price.toLocaleString()}</TableCell>
                <TableCell>{product.discount_percentage}%</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.sold}</TableCell>
                <TableCell>{product.shop_name}</TableCell>
                <TableCell className='!flex !h-[110px]'>
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                  <IconButton>
                    <DeleteIcon onClick={() => onDelete(product.uuid)} />
                  </IconButton>
                </TableCell>
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
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25]}
        sx={{ borderTop: '1px solid #e2e8f0' }}
      />
    </Card>
  );
};

export default ProductTable;
