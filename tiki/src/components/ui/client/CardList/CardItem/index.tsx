import type { ProductResponse } from '@/api/products/type';
import { ROUTES } from '@/lib/routes';
import { cn, convertToVietnameseDate } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

interface Props extends ProductResponse {}

function CardItem({
  uuid,
  name,
  slug,
  new_price,
  old_price,
  discount_percentage,
  estimated_delivery_date,
  sold,
  images,
  average_rating,
}: Props) {
  return (
    <Link
      href={ROUTES.PRODUCT.replace(':slug', slug).replace(':productId', uuid)}
      className='card__item'
      data-id={uuid}
    >
      <div className='card__item-thumbnail'>
        <img src={images?.[0].url} alt={name} />
      </div>
      <div className='card__item-content'>
        <p className='card__item-title'>{name}</p>
        <div className='card__item-rating-count'>
          <div className='card__item-rating h-4'>
            {!!average_rating &&
              Array.from({ length: average_rating }).map((_, index) => (
                <svg
                  key={index}
                  stroke='currentColor'
                  fill='currentColor'
                  strokeWidth='0'
                  viewBox='0 0 24 24'
                  color='#fdd836'
                  height='14'
                  width='14'
                  xmlns='http://www.w3.org/2000/svg'
                  style={{ color: 'rgb(253, 216, 54)' }}
                >
                  <path d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'></path>
                </svg>
              ))}
          </div>
          {/* <div className='card__item-count'>Đã bán {sold}</div> */}
        </div>
        <p className={cn('card__item-price', !!discount_percentage && 'discount')}>
          {new_price.toLocaleString('vi', {
            style: 'currency',
            currency: 'VND',
          })}
        </p>
        {!!discount_percentage && (
          <div className='flex items-start'>
            <span className='card__item-price--discount'>-{discount_percentage}%</span>
            <span className='text-[10px] line-through'>
              {old_price?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
            </span>
          </div>
        )}
      </div>
      <div className='card__item-footer'>
        <p>{convertToVietnameseDate(estimated_delivery_date ?? '')}</p>
      </div>
    </Link>
  );
}

export default CardItem;
