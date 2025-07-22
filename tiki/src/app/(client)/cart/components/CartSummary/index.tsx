import { useAuth } from '@/hooks/useAuth';
import { formatPriceToVnd } from '@/lib/utils';
import { Button } from '@mui/material';

interface CartSummaryProps {
  totalPriceAll: number;
  selectedItems: string[];
  onCheckout: () => void;
  fee: number;
}

export function CartSummary({ totalPriceAll, selectedItems, onCheckout, fee }: CartSummaryProps) {
  const { isAuthenticated } = useAuth();

  const totalPrice = totalPriceAll + fee;
  return (
    <div className='cart__checkout-body'>
      <div className='cart__checkout-price'>
        <div className='cart__checkout-price-top'>
          <p className='cart__checkout-price--label'>Phí vận chuyển</p>
          <p className='cart__checkout-price-price'>{formatPriceToVnd(fee)}</p>
        </div>
        <div className='cart__checkout-price-top'>
          <p className='cart__checkout-price--label'>Đơn hàng</p>
          <p className='cart__checkout-price-price'>{formatPriceToVnd(totalPriceAll)}</p>
        </div>
        <div className='cart__checkout-price-body'>
          <p className='cart__checkout-price--label'>Tổng tiền</p>
          <p className='cart__checkout-price--final'>
            {totalPriceAll === 0 ? (
              <span style={{ fontSize: 14 }}>Vui lòng chọn sản phẩm</span>
            ) : (
              formatPriceToVnd(totalPrice)
            )}
          </p>
        </div>
      </div>
      <Button
        type='submit'
        onClick={onCheckout}
        variant='contained'
        color='red'
        fullWidth
        className='mt-4'
        disabled={!isAuthenticated}
      >
        Mua Hàng ({selectedItems.length})
      </Button>
    </div>
  );
}
