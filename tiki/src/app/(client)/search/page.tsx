'use client';

import { useProductsQuery } from '@/api/products/query';
import type { ProductResponseType } from '@/api/products/schema';
import { useShopsQuery } from '@/api/shop/query';
import type { ShopResponseType } from '@/api/shop/type';
import CardItem from '@/components/ui/client/CardList/CardItem';
import { Checkbox, CircularProgress, Slider } from '@mui/material';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import './style.scss';

interface FilterState {
  name?: string;
  min_price?: number;
  max_price?: number;
  shop_id?: string;
  limit?: number;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  console.log({ query });
  const [filter, setFilter] = useState<FilterState>({
    name: query,
    min_price: undefined,
    max_price: undefined,
    shop_id: undefined,
    limit: 20,
  });
  const [priceRange, setPriceRange] = useState<number[]>([0, 230000]);

  const { data: products, isLoading } = useProductsQuery(filter);
  const { data: shops } = useShopsQuery({});

  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      name: query,
    }));
  }, [query]);

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    const range = newValue as number[];
    setPriceRange(range);
    setFilter((prev) => ({
      ...prev,
      min_price: range[0],
      max_price: range[1],
    }));
  };

  const priceFilters = [
    { label: 'Dưới 80.000', min: 0, max: 80000 },
    { label: '80.000 - 140.000', min: 80000, max: 140000 },
    { label: '140.000 - 230.000', min: 140000, max: 230000 },
    { label: 'Trên 230.000', min: 230000, max: Infinity },
  ];

  console.log({ products });

  return (
    <div className='pt-10 pb-10'>
      <div className='container mx-auto px-4'>
        <div className='flex gap-8'>
          {/* Sidebar Filter */}
          <div
            data-lenis-prevent
            className='scrollbar-hide sticky top-[48px] mb-10 h-[calc(100vh-48px-40px)] w-64 space-y-6 overflow-y-auto rounded-2xl bg-white p-4'
          >
            <div className=''>
              <h3 className='mb-2 font-semibold text-lg'>Lọc theo giá</h3>
              {priceFilters.map((range) => (
                <div key={range.label} className='mb-2 flex items-center'>
                  <Checkbox
                    checked={
                      filter.min_price === range.min &&
                      (range.max === Infinity ? filter.max_price === undefined : filter.max_price === range.max)
                    }
                    onChange={() =>
                      setFilter((prev) => ({
                        ...prev,
                        min_price: range.min,
                        max_price: range.max === Infinity ? undefined : range.max,
                      }))
                    }
                  />
                  <span>{range.label}</span>
                </div>
              ))}
              <div className='mt-4'>
                <Slider
                  value={priceRange}
                  onChange={handlePriceChange}
                  valueLabelDisplay='auto'
                  min={0}
                  max={300000}
                  className='w-full'
                />
                <div className='mt-2 flex justify-between text-sm'>
                  <span>{priceRange[0].toLocaleString()} VNĐ</span>
                  <span>{priceRange[1].toLocaleString()} VNĐ</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className='mb-2 font-semibold text-lg'>Lọc theo cửa hàng</h3>
              {shops?.items.map((shop: ShopResponseType) => (
                <div key={shop.uuid} className='mb-2 flex items-center'>
                  <Checkbox
                    checked={filter.shop_id === shop.uuid}
                    onChange={() =>
                      setFilter((prev) => ({
                        ...prev,
                        shop_id: prev.shop_id === shop.uuid ? undefined : shop.uuid,
                      }))
                    }
                  />
                  <span>{shop.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product List */}
          <div className='flex-1'>
            <h1 className='mb-4 font-bold text-2xl'>Kết quả tìm kiếm cho "{query}"</h1>
            {isLoading ? (
              <div className='flex h-[400px] w-full items-center justify-center text-center'>
                <CircularProgress />
              </div>
            ) : !products || products?.items.length === 0 ? (
              <div className='flex h-[400px] w-full flex-col items-center justify-center gap-4 text-center'>
                <Image src='/images/empty.png' alt='' width={78} height={78} />
                <p>Không tìm thấy sản phẩm</p>
              </div>
            ) : (
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {products?.items.map((product: ProductResponseType) => (
                  <CardItem key={product.uuid} {...product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
