import type { CartItemResponseType } from '@/api/cart-items/type';
import { Icons } from '@/assets/icons';
import { Button } from '@mui/material';

interface CartHeaderProps {
  cart: CartItemResponseType[] | undefined;
  selectAll: boolean;
  selectedItems: string[];
  onSelectAll: () => void;
  onClickRemove: () => void;
}

export function CartHeader({ cart, selectAll, selectedItems, onSelectAll, onClickRemove }: CartHeaderProps) {
  return (
    <div className='cart__table-head'>
      <div className='cart__table-row'>
        <div className='cart__table-col'>
          <input
            type='checkbox'
            id='table-checkbox-1'
            className='cart__table-checkbox cart__checkbox-all'
            checked={selectAll}
            onChange={onSelectAll}
          />
          <label htmlFor='table-checkbox-1' className='cart__table-label cart__select-all-product'>
            Tất cả ({cart?.length || 0} sản phẩm)
          </label>
        </div>
        <div className='cart__table-col' style={{ margin: '0 15px' }}>
          <span className='cart__table-label'>Đơn giá</span>
        </div>
        <div className='cart__table-col'>
          <span className='cart__table-label'>Số lượng</span>
        </div>
        <div className='cart__table-col'>
          <span className='cart__table-label'>Thành tiền</span>
        </div>
        <div className='cart__table-col'>
          <Button
            variant='text'
            className='cart__table-btn-remove cart__table-btn-remove-all'
            title='Xoá mục đã chọn'
            onClick={onClickRemove}
            disabled={selectedItems.length === 0}
          >
            <Icons.trash />
          </Button>
        </div>
      </div>
    </div>
  );
}
