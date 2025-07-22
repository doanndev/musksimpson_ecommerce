'use client';
import type { AddressResponse } from '@/api/addresses/type';
import { useCurrentUserQuery } from '@/api/user/query';
import { FormWrapper } from '@/components/ui/common/forms';
import type { AddressFormData } from '@/lib/validations/address';
import { addressSchema } from '@/lib/validations/address';
import { useCheckoutStore } from '@/stores/checkoutStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import CheckoutAddress from './components/CheckoutAddress';
import DeliverySelection from './components/DeliverySelection';
import OrderSummary from './components/OrderSummary';
import PaymentSelection from './components/PaymentSelection';
import './style.scss';

interface AddressState {
  provinces: any[];
  districts: any[];
  wards: any[];
}

function CheckoutPage() {
  const { data: user } = useCurrentUserQuery();
  const router = useRouter();

  const [savedAddress, setSavedAddress] = useState<AddressResponse | null>(null);
  const { selectedProducts } = useCheckoutStore();

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      paymentMethod: 'cash-on-delivery',
    },
  });

  useEffect(() => {
    if (user?.addresses?.length) {
      const defaultAddress = user.addresses.find((addr: any) => addr.is_default) || user.addresses[0];
      setSavedAddress(defaultAddress);
    }
  }, [user]);

  //   useEffect(() => {
  //     if (selectedProducts.items.length === 0) {
  //       router.push(ROUTES.CART);
  //     }
  //   }, [selectedProducts, router]);

  const totalPrice = useMemo(() => {
    const uniqueShopFees = new Map<string, number>();
    let productTotal = 0;

    for (const product of selectedProducts.items) {
      productTotal += product.new_price * product.quantity;
      if (!uniqueShopFees.has(product.shop?.uuid ?? '')) {
        uniqueShopFees.set(product.shop?.uuid ?? '', product.fee ?? 0);
      }
    }

    const totalFee = Array.from(uniqueShopFees.values()).reduce((sum, fee) => sum + fee, 0);
    return productTotal;
  }, [selectedProducts]);

  const paymentMethod = form.watch('paymentMethod');

  return (
    <div className='checkout container'>
      <FormWrapper form={form} className='checkout__left'>
        <DeliverySelection />
        <PaymentSelection />
      </FormWrapper>
      <div className='checkout__right'>
        {savedAddress ? (
          <CheckoutAddress
            fullName={savedAddress.full_name}
            phoneNumber={savedAddress.phone_number}
            address={`${savedAddress.address ?? ''}, ${savedAddress.ward_name ?? ''}, ${savedAddress.district_name ?? ''}, ${savedAddress.province_name ?? ''}`}
            typeAddress={savedAddress.type_address || ''}
          />
        ) : (
          <CheckoutAddress fullName='N/A' phoneNumber='N/A' address='Please save an address' typeAddress='N/A' />
        )}
        <OrderSummary totalPrice={totalPrice} paymentMethod={paymentMethod} address={savedAddress} />
      </div>
    </div>
  );
}

export default CheckoutPage;
