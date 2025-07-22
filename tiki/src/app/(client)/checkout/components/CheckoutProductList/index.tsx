'use client';

import { formatPriceToVnd } from '@/lib/utils'; // Assuming this utility exists
import { Typography } from '@mui/material';
import React from 'react';

// Define types based on ProductResponseSchema and additional UI needs
interface Product {
  uuid: string;
  name: string;
  price: number;
  quantity: number;
  discountPrice?: number;
  image?: string;
}

interface ProductPackage {
  packageId: string;
  deliveryDate: string;
  seller: string;
  totalPrice: number;
  products: Product[];
}

interface CheckoutProductListProps {
  packages: ProductPackage[];
}

export const CheckoutProductList: React.FC<CheckoutProductListProps> = ({ packages }) => {
  return (
    <div className='checkout--bg-white'>
      <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2 }}>
        Chọn hình thức giao hàng
      </Typography>
      {packages.map((pkg, index) => (
        <div key={pkg.packageId} className='mb-4 rounded-2xl border border-gray-200 bg-white p-4'>
          <div className='mb-4 flex items-center justify-between'>
            <div className='flex items-center'>
              <span className='mr-2 rounded bg-green-500 px-2 py-1 font-semibold text-white text-xs'>
                Gói {index + 1}: Giao {pkg.deliveryDate}
              </span>
              <span className='font-bold text-gray-800 text-sm uppercase'>Giao tiết kiệm</span>
            </div>
            <div className='flex items-center'>
              <span className='mr-2 font-bold text-gray-800 text-sm'>{formatPriceToVnd(pkg.totalPrice)}</span>
              <span className='rounded border border-gray-300 px-2 py-1 text-gray-600 text-xs'>
                Được giao bởi {pkg.seller}
              </span>
            </div>
          </div>

          {pkg.products.map((product) => (
            <div key={product.uuid} className='mb-4 flex items-center border-gray-100 border-b pb-4 last:border-b-0'>
              {/* Product Image */}
              <div className='mr-4'>
                <img
                  src={product.image || '/placeholder-image.png'}
                  alt={product.name}
                  className='h-16 w-16 rounded object-cover'
                />
              </div>

              {/* Product Details */}
              <div className='flex-1'>
                <p className='line-clamp-2 text-gray-800 text-sm'>{product.name}</p>
                <p className='mt-1 text-gray-500 text-xs'>SL: x{product.quantity}</p>
              </div>

              <div className='text-right'>
                {product.discountPrice ? (
                  <>
                    <p className='text-gray-500 text-xs line-through'>{formatPriceToVnd(product.price)}</p>
                    <p className='font-semibold text-red-600 text-sm'>{formatPriceToVnd(product.discountPrice)}</p>
                  </>
                ) : (
                  <p className='font-semibold text-gray-800 text-sm'>{formatPriceToVnd(product.price)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
