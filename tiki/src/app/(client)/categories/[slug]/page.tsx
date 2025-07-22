'use client';

import { useCategoriesQuery } from '@/api/categories/query';
import CardList from '@/components/ui/client/CardList';
import { Box, Skeleton, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import React from 'react';

function CategoryPage() {
  const { slug } = useParams();
  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    error: categoryError,
  } = useCategoriesQuery({ slug: slug as string });

  const LoadingSkeleton = () => (
    <Box sx={{ mb: 6 }}>
      <Skeleton variant='text' width={200} height={40} sx={{ mb: 2 }} />
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className='card__item overflow-hidden rounded-lg bg-white shadow-md'>
            <Skeleton variant='rectangular' className='card__item-thumbnail' height={200} />
            <div className='card__item-content p-4'>
              <Skeleton variant='text' height={20} style={{ marginBottom: 8 }} />
              <Skeleton variant='text' width={100} height={20} style={{ marginBottom: 8 }} />
              <Skeleton variant='text' width={80} height={24} />
            </div>
          </div>
        ))}
      </div>
    </Box>
  );

  return (
    <main id='main' className='main min-h-screen bg-gray-100 py-8'>
      <div className='home container mx-auto px-4'>
        <div className='flex flex-col gap-6 lg:flex-row'>
          <div className='home__body flex-1'>
            {isCategoryLoading ? (
              <LoadingSkeleton />
            ) : categoryError ? (
              <Typography variant='h6' color='error'>
                Không tìm thấy danh mục
              </Typography>
            ) : !categoryData || categoryData.length === 0 ? (
              <Typography variant='h6'>Không tìm thấy danh mục</Typography>
            ) : (
              <>
                <Typography variant='h4' sx={{ mb: 4, fontWeight: 'bold' }}>
                  {categoryData?.[0].name}
                </Typography>
                <CardList category_id={categoryData?.[0].uuid} />
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default CategoryPage;
