'use client';

import { useProductsQuery } from '@/api/products/query';

import React, { useEffect, useState } from 'react';
import ProductTable from './components/ProductTable';

function ProductPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading, refetch } = useProductsQuery({
    limit: rowsPerPage,
    offset: page * rowsPerPage,
  });

  useEffect(() => {
    refetch();
  }, []);

  const handlePageChange = (_: unknown, newPage: number) => setPage(newPage);

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const products =
    data?.items.map((product) => ({
      uuid: product.uuid,
      name: product.name,
      image: product.images?.find((img) => img.is_primary)?.url ?? '',
      old_price: product.old_price,
      new_price: product.new_price,
      discount_percentage: product.discount_percentage,
      stock: product.stock,
      sold: product.sold,
      shop_name: product.shop?.name,
      is_deleted: product.is_deleted,
      updated_at: product.updated_at,
    })) ?? [];

  const handleDelete = (productId: string) => {
    console.log('Delete product with ID:', productId);
  };

  return (
    <div className='px-6 pb-6'>
      <h1 className='mb-4 font-semibold text-2xl'>Product Management</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ProductTable
          products={products}
          page={page}
          rowsPerPage={rowsPerPage}
          totalItems={data?.meta.totalItem || 0}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default ProductPage;
