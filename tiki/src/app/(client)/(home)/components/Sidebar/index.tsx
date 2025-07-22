'use client';

import { useCategoriesQuery } from '@/api/categories/query';
import { Box, Skeleton } from '@mui/material';
import Link from 'next/link';
import React from 'react';

function Sidebar() {
  const { data: categories, isLoading: isCategoriesLoading } = useCategoriesQuery({ limit: 100, parent: 'true' });

  const LoadingSkeleton = () => (
    <Box className='home__sidebar-link' sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Skeleton variant='rectangular' width={24} height={24} className='home__sidebar-icon' sx={{ mr: 1 }} />
      <Skeleton variant='text' width={120} height={20} className='home__sidebar-text' />
    </Box>
  );

  return (
    <div className='home__sidebar' data-lenis-prevent>
      <div className='home__sidebar-box'>
        <h4 className='home__sidebar-title'>Danh mục</h4>
        <div className='home__sidebar-list home__categories'>
          {isCategoriesLoading
            ? // Show 5 skeleton placeholders to mimic category links
              Array.from({ length: 5 }).map((_, index) => <LoadingSkeleton key={index} />)
            : categories
                ?.filter((category) => category.icon !== null)
                ?.map(({ uuid: id, icon, name, slug }) => (
                  <Link
                    key={id}
                    href={`/categories/${slug}`}
                    className='home__sidebar-link'
                    title={name}
                    data-category={id}
                  >
                    <img src={icon || ''} alt='' className='home__sidebar-icon' />
                    <span className='home__sidebar-text' dangerouslySetInnerHTML={{ __html: name }} />
                  </Link>
                ))}
        </div>
      </div>
      <div className='home__sidebar-box'>
        <div className='home__sidebar-list'>
          <a href='#!' className='home__sidebar-link' title='Bán hàng cùng Musksimpson'>
            <img
              src='https://salt.tikicdn.com/cache/100x100/ts/upload/08/2f/14/fd9d34a8f9c4a76902649d04ccd9bbc5.png.webp'
              alt=''
              className='home__sidebar-icon'
            />
            <span className='home__sidebar-text'>Bán hàng cùng Musksimpson</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
