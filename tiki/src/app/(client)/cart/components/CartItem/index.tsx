import type { CartItemResponseType } from '@/api/cart-items/type';
import { Icons } from '@/assets/icons';
import { ROUTES } from '@/lib/routes';
import { formatPriceToVnd } from '@/lib/utils';
import { Button } from '@mui/material';
import Link from 'next/link';
import type { ChangeEvent } from 'react';

interface CartItemProps {
  item: CartItemResponseType;
  selectedItems: string[];
  onSelectItem: (itemId: string) => void;
  onIncrementQuantity: (productId: string) => void;
  onDecrementQuantity: (productId: string) => void;
  onChangeQuantity: (e: ChangeEvent<HTMLInputElement>, productId: string) => void;
  onRemoveItem: (id: number) => void;
}

export function CartItem({
  item,
  selectedItems,
  onSelectItem,
  onIncrementQuantity,
  onDecrementQuantity,
  onChangeQuantity,
  onRemoveItem,
}: CartItemProps) {
  return (
    <div className='cart__table-group'>
      <div className='cart__table-row'>
        <div className='cart__table-col'>
          <input
            type='checkbox'
            id={`table-checkbox-${item.id + 99}`}
            className='cart__table-checkbox cart__checkbox-item'
            checked={selectedItems.includes(item.product.uuid)}
            onChange={() => onSelectItem(item.product.uuid)}
          />
          <Link
            href={ROUTES.PRODUCT.replace(':slug', item.product.slug).replace(':productId', item.product.uuid)}
            className='cart__table-product'
          >
            <img
              src={item.product.images?.[0]?.url ?? ''}
              alt={item.product.name}
              className='cart__table-product-image'
            />
            <span className='cart__table-product-name'>{item.product.name}</span>
          </Link>
        </div>
        <div className='cart__table-col cart__table-price'>
          <span className='price-current'>{formatPriceToVnd(item.product.new_price)}</span>
        </div>
        <div className='cart__table-col cart__table-quantity'>
          <button
            className='cart__table-quantity-btn cart__table-quantity-btn-minus'
            onClick={() => onDecrementQuantity(item.product.uuid)}
            disabled={item.quantity <= 1}
          >
            <Icons.remove />
          </button>
          <input
            type='number'
            className='cart__table-quantity-input'
            value={item.quantity}
            onChange={(e) => onChangeQuantity(e, item.product.uuid)}
            min='1'
          />
          <button
            className='cart__table-quantity-btn cart__table-quantity-btn-plus'
            onClick={() => onIncrementQuantity(item.product.uuid)}
          >
            <Icons.add />
          </button>
        </div>
        <div className='cart__table-col cart__table-money'>
          <span>{formatPriceToVnd(item.product.new_price * item.quantity)}</span>
        </div>
        <div className='cart__table-col'>
          <Button
            variant='text'
            className='cart__table-btn-remove cart__table-btn-remove-one'
            onClick={() => onRemoveItem(item.id)}
          >
            <Icons.trash />
          </Button>
        </div>
      </div>
    </div>
  );
}
