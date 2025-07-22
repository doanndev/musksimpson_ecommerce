import type { AddressResponse } from '@/api/addresses/type';
import { ROUTES } from '@/lib/routes';
import { formatPriceToVnd } from '@/lib/utils';
import type { AddressFormData } from '@/lib/validations/address';
import { useCheckoutStore } from '@/stores/checkoutStore';
import Link from 'next/link';
import CashOnDeliveryButton from '../CashOnDeliveryButton';
import PayPalmentButton from '../PayPalmentButton';

interface Props {
  totalPrice: number;
  paymentMethod: AddressFormData['paymentMethod'];
  address: AddressResponse | null;
}

function OrderSummary({ totalPrice, paymentMethod, address }: Props) {
  const { selectedProducts } = useCheckoutStore();
  const fee = selectedProducts.items.reduce((acc, item) => acc + (item.fee || 0), 0);

  return (
    <div className='checkout__order checkout--bg-white'>
      <div className='checkout__order-header'>
        <div className='checkout__order-title'>
          <h4 className='checkout__order--heading'>Đơn hàng</h4>
          <Link href={ROUTES.CART}>Thay đổi</Link>
        </div>
      </div>
      <div className='checkout__order-body'>
        <div className='checkout__order-price'>
          <div className='checkout__order-price-top'>
            <p className='checkout__order-price--label'>Phí Vận chuyển</p>
            <p className='checkout__order-price-price'>{formatPriceToVnd(fee)}</p>
          </div>
          <div className='checkout__order-price-top'>
            <p className='checkout__order-price--label'>Đơn Hàng</p>
            <p className='checkout__order-price-price'>{formatPriceToVnd(totalPrice)}</p>
          </div>
          <div className='checkout__order-price-body'>
            <p className='checkout__order-price--label'>Tổng tiền</p>
            <p className='checkout__order-price--final'>{formatPriceToVnd(totalPrice + fee)}</p>
          </div>
        </div>
        {paymentMethod === 'cash-on-delivery' && <CashOnDeliveryButton cart={selectedProducts} address={address} />}
        {paymentMethod === 'paypal-money' && <PayPalmentButton cart={selectedProducts} />}
      </div>
    </div>
  );
}

export default OrderSummary;
