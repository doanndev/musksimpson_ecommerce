'use client';

import type { AddressResponse } from '@/api/addresses/type';
import { useCartItems, useDeleteCartItemMutation } from '@/api/cart-items/query';
import { updateCartItemRequest } from '@/api/cart-items/request';
import { useCurrentUserQuery } from '@/api/user/query';
import ModalRemove from '@/components/ui/client/ModalRemove';
import ModalWarning from '@/components/ui/client/ModalWarning';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/lib/routes';
import { onMutateError } from '@/lib/utils';
import { useCheckoutStore } from '@/stores/checkoutStore';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { type ChangeEvent, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import CheckoutAddress from '../checkout/components/CheckoutAddress';
import { CartHeader } from './components/CartHeader';
import { CartItem } from './components/CartItem';
import { CartSummary } from './components/CartSummary';
import './style.scss';

function CartPage() {
  const { isAuthenticated } = useAuth();
  const { data: user } = useCurrentUserQuery();

  const router = useRouter();

  const { data: cart, refetch } = useCartItems({ user_id: user?.uuid ?? '' });

  const [openRemove, setOpenRemove] = useState<boolean>(false);
  const [openWarning, setOpenWarning] = useState<boolean>(false);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [itemToRemove, setItemToRemove] = useState<number | null>(null);

  const [savedAddress, setSavedAddress] = useState<AddressResponse | null>(null);

  useEffect(() => {
    if (user?.addresses?.length) {
      const defaultAddress = user.addresses.find((addr: any) => addr.is_default) || user.addresses[0];
      setSavedAddress(defaultAddress);
    }
  }, [user]);

  const { setCheckoutData } = useCheckoutStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (cart && cart.length > 0) {
      const allSelected = cart.every((item) => selectedItems.includes(item.product.uuid));
      setSelectAll(allSelected);
    } else {
      setSelectAll(false);
    }
  }, [selectedItems, cart]);

  const { mutate: updateCartItem } = useMutation({
    mutationFn: updateCartItemRequest,
    onSuccess: () => {
      refetch();
      toast.success('Cập nhật giỏ hàng thành công');
    },
    onError: onMutateError,
  });

  const { mutate: deleteCartItem } = useDeleteCartItemMutation({
    onSuccess: () => {
      refetch();
      toast.success('Xóa sản phẩm thành công');
    },
    onError: onMutateError,
  });

  const handleOpenRemove = (id: number | null = null) => {
    setItemToRemove(id);
    setOpenRemove(true);
  };

  const handleCloseRemove = () => {
    setOpenRemove(false);
    setItemToRemove(null);
  };

  const handleOpenWarning = () => setOpenWarning(true);
  const handleCloseWarning = () => setOpenWarning(false);

  const handleSelectAll = () => {
    if (!cart) return;
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map((item) => item.product.uuid));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]));
  };

  const handleClickRemove = () => {
    if (selectedItems.length === 0) {
      handleOpenWarning();
      return;
    }
    handleOpenRemove();
  };

  const handleRemoveOrder = () => {
    if (itemToRemove !== null) {
      deleteCartItem({ id: itemToRemove });
      const removedItem = cart?.find((item) => item.id === itemToRemove);
      if (removedItem) {
        setSelectedItems((prev) => prev.filter((id) => id !== removedItem.product.uuid));
      }
    } else {
      const selectedUuids = selectedItems;
      cart
        ?.filter((item) => selectedUuids.includes(item.product.uuid))
        .forEach((item) => {
          deleteCartItem({ id: item.id });
        });
      // Xoá tất cả uuid đã chọn
      setSelectedItems((prev) => prev.filter((id) => !selectedUuids.includes(id)));
    }
    handleCloseRemove();
  };

  const handleIncrementQuantity = async (productId: string) => {
    const cartItem = cart?.find((item) => item.product.uuid === productId);
    if (!cartItem) return;

    const newQuantity = cartItem.quantity + 1;
    if (newQuantity > cartItem.product.stock + cartItem.quantity) {
      toast.error('Số lượng vượt quá tồn kho!');
      return;
    }

    updateCartItem({ id: cartItem.id, quantity: newQuantity });
  };

  const handleDecrementQuantity = async (productId: string) => {
    const cartItem = cart?.find((item) => item.product.uuid === productId);
    if (!cartItem || cartItem.quantity <= 1) return;

    updateCartItem({ id: cartItem.id, quantity: cartItem.quantity - 1 });
  };

  const handleChangeQuantity = async (e: ChangeEvent<HTMLInputElement>, productId: string) => {
    const cartItem = cart?.find((item) => item.product.uuid === productId);
    if (!cartItem) return;

    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) return;

    if (value > cartItem.product.stock + cartItem.quantity) {
      toast.error('Số lượng vượt quá tồn kho!');
      return;
    }

    updateCartItem({ id: cartItem.id, quantity: value });
  };
  // const [shippingFee, setShippingFee] = useState(0);
  // const enabled = selectedItems.length > 0;

  // useEffect(() => {
  //   if (!enabled || !cart || !Array.isArray(cart)) {
  //     setShippingFee(0);
  //   } else {
  //     const fee = cart.reduce((sum, item) => sum + (item.product.fee || 0), 0);
  //     setShippingFee(fee);
  //   }
  // }, [cart, enabled]);

  const totalFee = useMemo(() => {
    const subtotal =
      cart?.reduce((total, item) => {
        if (selectedItems.includes(item.product.uuid)) {
          return total + (item.product.fee || 0);
        }
        return total;
      }, 0) || 0;

    return subtotal;
  }, [cart, selectedItems]);

  const totalPriceAll = useMemo(() => {
    const subtotal =
      cart?.reduce((total, item) => {
        if (selectedItems.includes(item.product.uuid)) {
          return total + item.product.new_price * item.quantity;
        }
        return total;
      }, 0) || 0;

    return subtotal;
  }, [cart, selectedItems]);

  const handleCheckout = () => {
    if (!isAuthenticated) return;

    if (selectedItems.length === 0) {
      handleOpenWarning();
      return;
    }

    const selectedProducts =
      cart
        ?.filter((item) => selectedItems.includes(item.product.uuid))
        .map((item) => ({
          ...item.product,
          cartId: item.id,
          quantity: item.quantity,
        })) || [];

    setCheckoutData({ items: selectedProducts, total_amount: totalPriceAll, type: 'cart' });
    router.push(ROUTES.CHECKOUT);
  };

  return (
    <>
      <main id='main' className='main'>
        <div className='cart container'>
          <h3 className='cart--heading'>GIỎ HÀNG</h3>
          <div className='cart__container'>
            <div className='cart__table'>
              <CartHeader
                cart={cart}
                selectAll={selectAll}
                selectedItems={selectedItems}
                onSelectAll={handleSelectAll}
                onClickRemove={handleClickRemove}
              />
              <div className='cart__table-body'>
                {cart?.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    selectedItems={selectedItems}
                    onSelectItem={handleSelectItem}
                    onIncrementQuantity={handleIncrementQuantity}
                    onDecrementQuantity={handleDecrementQuantity}
                    onChangeQuantity={handleChangeQuantity}
                    onRemoveItem={handleOpenRemove}
                  />
                ))}
              </div>
            </div>
            <div className='cart__checkout'>
              <div className='mb-4'>
                {savedAddress ? (
                  <CheckoutAddress
                    fullName={savedAddress.full_name}
                    phoneNumber={savedAddress.phone_number}
                    address={`${savedAddress.address ?? ''}, ${savedAddress.ward_name ?? ''}, ${savedAddress.district_name ?? ''}, ${savedAddress.province_name ?? ''}`}
                    typeAddress={savedAddress.type_address || ''}
                  />
                ) : (
                  <CheckoutAddress
                    fullName='N/A'
                    phoneNumber='N/A'
                    address='Please save an address'
                    typeAddress='N/A'
                  />
                )}
              </div>
              {/* <CouponSection /> */}
              <CartSummary
                fee={totalFee}
                totalPriceAll={totalPriceAll}
                selectedItems={selectedItems}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        </div>
      </main>

      <ModalRemove
        open={openRemove}
        handleRemove={handleRemoveOrder}
        handleClose={handleCloseRemove}
        content={itemToRemove ? 'Bạn có chắc muốn xóa sản phẩm này?' : 'Bạn có chắc muốn xóa các sản phẩm đã chọn?'}
      />
      <ModalWarning open={openWarning} content='Bạn chưa chọn sản phẩm nào' handleClose={handleCloseWarning} />
    </>
  );
}

export default CartPage;
