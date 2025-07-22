import { useProductsQuery } from '@/api/products/query';
import type { ProductFilter, ProductResponse } from '@/api/products/type';
import { Button, Skeleton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CardItem from './CardItem';
import './styles.scss';

interface Props {
  category_id?: string;
}

const LIMIT_PRODUCTS = 20;

function CardList({ category_id }: Props) {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [page, setPage] = useState<number>(1);

  const filter: ProductFilter = { limit: LIMIT_PRODUCTS, offset: page, category_id };
  const { data, isLoading, isFetching } = useProductsQuery(filter);

  const handleLoadMore = () => {
    if (!isFetching) {
      setPage((prevPage) => prevPage + LIMIT_PRODUCTS);
    }
  };

  useEffect(() => {
    if (data?.items) {
      setProducts((prev) => {
        const newProducts = data.items.filter((item) => !prev.some((p) => p.uuid === item.uuid));
        return [...prev, ...newProducts];
      });
    }
  }, [data]);

  const LoadingSkeleton = () => (
    <div className='card__item'>
      <Skeleton variant='rectangular' className='card__item-thumbnail' height={200} />
      <div className='card__item-content'>
        <Skeleton variant='text' height={20} style={{ marginBottom: 8 }} />
        <Skeleton variant='text' width={100} height={20} style={{ marginBottom: 8 }} />
        <Skeleton variant='text' width={80} height={24} />
      </div>
    </div>
  );

  return (
    <div className='card'>
      <div className='card__container'>
        <div className='grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'>
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => <LoadingSkeleton key={index} />)
            : products.map((product) => <CardItem key={product.uuid} {...product} />)}
        </div>
      </div>

      <div className='mx-auto mb-6 flex w-full max-w-[150px] justify-center'>
        <Button variant='outlined' color='primary' fullWidth onClick={handleLoadMore}>
          Xem thêm
        </Button>
      </div>
    </div>
  );
}

export default CardList;
