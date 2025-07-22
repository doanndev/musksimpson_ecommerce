'use client';

import {
  AddressQueryKey,
  useCreateAddressMutation,
  useDeleteAddressMutation,
  useUpdateAddressMutation,
} from '@/api/addresses/query';
import type { AddressCreateInput, AddressResponse } from '@/api/addresses/type';
import { useCartItems } from '@/api/cart-items/query';
import { ProductQueryKey, useProductByIdQuery } from '@/api/products/query';
import { UserQueryKey, useCurrentUserQuery } from '@/api/user/query';
import { queryClient } from '@/app/providers';
import { FormWrapper } from '@/components/ui/common/forms';
import { fetchDistricts, fetchProvinces, fetchWards } from '@/lib/ghn';
import { onMutateError } from '@/lib/utils';
import { type AddressFormData, addressSchema } from '@/lib/validations/address';
import { type ProductCheckout, useCheckoutStore } from '@/stores/checkoutStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import AddressForm from '../components/AddressForm';
import AddressCard from './components/AddressCard/indix';
import './style.scss';

interface AddressState {
  provinces: any[];
  districts: any[];
  wards: any[];
}

const ShippingPage: React.FC = () => {
  const router = useRouter();
  const { data: user, refetch: refetchUser } = useCurrentUserQuery();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressState, setAddressState] = useState<AddressState>({ provinces: [], districts: [], wards: [] });
  const [editingAddress, setEditingAddress] = useState<AddressResponse | null>(null);
  const [isSelectingAddress, setIsSelectingAddress] = useState<number | null>(null); // New loading state
  const { data: cart, refetch: refetchCart } = useCartItems({ user_id: user?.uuid ?? '' });
  const { selectedProducts, setCheckoutData } = useCheckoutStore();
  const [productId, setProductId] = useState<string | null>(null);

  const { data: product } = useProductByIdQuery({ productId: productId ?? '' }, { enabled: !!productId });

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      province_id: 0,
      province_name: '',
      district_id: 0,
      district_name: '',
      ward_code: '',
      ward_name: '',
      address: '',
      region_id: 0,
      typeAddress: 'Nhà riêng',
      paymentMethod: 'cash-on-delivery',
      is_default: false,
    },
  });

  const { mutate: createAddress } = useCreateAddressMutation({
    onSuccess: () => handleMutationSuccess('Địa chỉ đã được thêm thành công!'),
    onError: onMutateError,
  });

  const { mutate: updateAddress } = useUpdateAddressMutation({
    onSuccess: () => handleMutationSuccess('Địa chỉ đã được cập nhật thành công!'),
    onError: onMutateError,
  });

  const { mutate: deleteAddress } = useDeleteAddressMutation({
    onSuccess: () => handleMutationSuccess('Địa chỉ đã được xóa thành công!'),
    onError: onMutateError,
  });

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [AddressQueryKey.ADDRESSES, ProductQueryKey.PRODUCTS, ProductQueryKey.PRODUCT],
    });
    queryClient.refetchQueries({
      queryKey: [ProductQueryKey.PRODUCTS, ProductQueryKey.PRODUCT, UserQueryKey.CURRENT_USER],
    });
    refetchUser();
    refetchCart();
  }, [refetchUser, refetchCart]);

  const handleMutationSuccess = useCallback(
    (message: string) => {
      invalidateQueries();
      setShowAddressForm(false);
      setEditingAddress(null);
      form.reset();
      toast.success(message);
    },
    [invalidateQueries, form]
  );

  const loadProvinces = useCallback(async () => {
    try {
      const provinces = await fetchProvinces();
      setAddressState((prev) => ({ ...prev, provinces }));
    } catch (error) {
      toast.error('Không thể tải danh sách tỉnh/thành. Vui lòng thử lại.');
    }
  }, []);

  useEffect(() => {
    loadProvinces();
  }, [loadProvinces]);

  const handleFetchDistricts = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const provinceId = Number(e.target.value);
      if (!provinceId) return;

      const selectedOption = (e.target as HTMLSelectElement).selectedOptions[0];
      const regionId = Number(selectedOption.getAttribute('data-region'));
      const provinceName = selectedOption.text;

      form.setValue('province_id', provinceId);
      form.setValue('province_name', provinceName);
      form.setValue('region_id', regionId);
      form.setValue('district_id', 0);
      form.setValue('district_name', '');
      form.setValue('ward_code', '');
      form.setValue('ward_name', '');

      try {
        const districts = await fetchDistricts(provinceId);
        setAddressState((prev) => ({ ...prev, districts, wards: [] }));
      } catch (error) {
        toast.error('Không thể tải danh sách quận/huyện. Vui lòng thử lại.');
      }
    },
    [form]
  );

  const handleFetchWards = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const districtId = Number(e.target.value);
      if (!districtId) return;

      form.setValue('district_id', districtId);
      const districtName = addressState.districts.find((d) => d.DistrictID === districtId)?.DistrictName || '';
      form.setValue('district_name', districtName);
      form.setValue('ward_code', '');
      form.setValue('ward_name', '');

      try {
        const wards = await fetchWards(districtId);
        setAddressState((prev) => ({ ...prev, wards }));
      } catch (error) {
        toast.error('Không thể tải danh sách phường/xã. Vui lòng thử lại.');
      }
    },
    [form, addressState.districts]
  );

  const mapAddressToFormData = useCallback(
    (addr: AddressResponse): AddressFormData => ({
      fullName: addr.full_name || '',
      phoneNumber: addr.phone_number || '',
      province_id: addr.province_id || 0,
      province_name: addr.province_name || '',
      district_id: addr.district_id || 0,
      district_name: addr.district_name || '',
      ward_code: addr.ward_code || '',
      ward_name: addr.ward_name || '',
      address: addr.address || '',
      region_id: addr.region_id || 0,
      typeAddress: addr.type_address === 'HOME' ? 'Nhà riêng' : 'Công ty',
      paymentMethod: 'cash-on-delivery',
      is_default: addr.is_default || false,
    }),
    []
  );

  const handleSubmit = useCallback(
    (data: AddressFormData) => {
      if (!user?.uuid) {
        toast.error('Vui lòng đăng nhập để tiếp tục!');
        return;
      }

      const addressData: AddressCreateInput = {
        user_id: user.uuid,
        full_name: data.fullName,
        phone_number: data.phoneNumber,
        address: data.address,
        province_id: Number(data.province_id),
        province_name: data.province_name,
        district_id: Number(data.district_id),
        district_name: data.district_name,
        ward_code: data.ward_code,
        ward_name: data.ward_name,
        type_address: data.typeAddress === 'Nhà riêng' ? 'HOME' : 'WORK',
        is_default: data.is_default,
        region_id: Number(data.region_id),
      };

      if (editingAddress) {
        updateAddress({ id: editingAddress.id, ...addressData });
      } else {
        createAddress(addressData);
      }
    },
    [user, editingAddress, createAddress, updateAddress]
  );

  const loadAddressData = useCallback(
    async (addr: AddressResponse, resetForm: boolean = true) => {
      if (resetForm) {
        form.reset(mapAddressToFormData(addr));
      }

      try {
        if (!addressState.provinces.length) await loadProvinces();

        if (addr.province_id) {
          const province = addressState.provinces.find((p) => p.ProvinceID === addr.province_id);
          if (province) {
            const districts = await fetchDistricts(addr.province_id);
            setAddressState((prev) => ({ ...prev, districts }));

            if (addr.district_id) {
              const wards = await fetchWards(addr.district_id);
              setAddressState((prev) => ({ ...prev, wards }));
            }
          }
        }
      } catch (error) {
        toast.error('Không thể tải dữ liệu địa chỉ. Vui lòng thử lại.');
      }
    },
    [form, addressState.provinces, loadProvinces, mapAddressToFormData]
  );

  const handleSelectAddress = useCallback(
    async (addr: AddressResponse) => {
      if (isSelectingAddress) return; // Prevent multiple clicks
      setIsSelectingAddress(addr.id);

      try {
        // Only update if the address is not already default
        if (!addr.is_default) {
          console.log('BACK: 1');
          updateAddress(
            { id: addr.id, ...mapAddressToFormData({ ...addr, is_default: true }) },
            {
              onSuccess: () => {
                // router.back();
              },
            }
          );
        }

        // Update checkout data based on type
        if (selectedProducts.type === 'cart') {
          const { data: updatedCart } = await refetchCart();
          if (updatedCart) {
            const updatedProducts = selectedProducts.items
              .map((item: ProductCheckout) => {
                const cartItem = updatedCart.find((cartItem) => cartItem.product.uuid === item.uuid);
                return cartItem ? { ...item, cartId: cartItem.id, quantity: cartItem.quantity } : null;
              })
              .filter((item) => item !== null);

            if (updatedProducts.length === 0) {
              toast.error('Không tìm thấy sản phẩm trong giỏ hàng.');
              setCheckoutData({ items: [], total_amount: 0, type: 'cart' });
              console.log('BACK: 3');
              router.back();
              return;
            }

            setCheckoutData({
              items: updatedProducts,
              total_amount: updatedProducts.reduce((sum, item) => sum + item.new_price * item.quantity, 0),
              type: 'cart',
            });
          } else {
            toast.error('Không thể tải giỏ hàng. Vui lòng thử lại.');
            console.log('BACK: 4');
            router.back();
            return;
          }
        } else if (selectedProducts.type === 'direct' && selectedProducts.items.length > 0) {
          setProductId(selectedProducts.items[0].uuid);
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.back();
      } catch (error) {
        toast.error('Lỗi khi chọn địa chỉ. Vui lòng thử lại.');
      } finally {
        setIsSelectingAddress(null);
      }
    },
    [isSelectingAddress, selectedProducts, refetchCart, setCheckoutData, router, updateAddress, mapAddressToFormData]
  );

  const handleEditAddress = useCallback(
    async (addr: AddressResponse) => {
      setShowAddressForm(true);
      setEditingAddress(addr);
      await loadAddressData(addr);
    },
    [loadAddressData]
  );

  const handleAddAddress = useCallback(async () => {
    setEditingAddress(null);
    setShowAddressForm(true);

    const defaultAddress = user?.addresses?.find((addr: AddressResponse) => addr.is_default) || user?.addresses?.[0];

    if (defaultAddress) {
      await loadAddressData(defaultAddress);
    } else {
      form.reset();
      setAddressState((prev) => ({ ...prev, districts: [], wards: [] }));
      await loadProvinces();
    }
  }, [form, user, loadProvinces, loadAddressData]);

  const handleResetForm = useCallback(() => {
    setShowAddressForm(false);
    setEditingAddress(null);
    form.reset();
  }, [form]);

  useEffect(() => {
    if (selectedProducts.type === 'direct' && product && productId) {
      const quantity = selectedProducts.items[0]?.quantity || 1;
      setCheckoutData({
        items: [{ ...product, quantity }],
        total_amount: product.new_price * quantity,
        type: 'direct',
      });
      setProductId(null);
    }
  }, [product, productId, selectedProducts, setCheckoutData]);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    refetchUser();
  }, [user]);

  const addresses = useMemo(() => user?.addresses ?? [], [user]);

  return (
    <div className='shipping container'>
      <div className='shipping__header'>
        <h2>2. Địa chỉ giao hàng</h2>
        <p>Chọn địa chỉ giao hàng có sẵn bên dưới:</p>
      </div>

      <div className='shipping__grid'>
        {addresses.map((addr) => (
          <AddressCard
            key={addr.id}
            address={addr}
            onSelect={handleSelectAddress}
            onEdit={handleEditAddress}
            onDelete={deleteAddress}
            canDelete={!addr.is_default && addresses.length > 1}
            isLoading={isSelectingAddress === addr.id}
          />
        ))}
      </div>

      <div className='shipping__add'>
        <p>
          Bạn muốn giao hàng đến địa chỉ khác?{' '}
          <a href='#!' onClick={handleAddAddress}>
            Thêm địa chỉ giao hàng mới
          </a>
        </p>
      </div>

      {showAddressForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <FormWrapper form={form} onSubmit={handleSubmit}>
            <AddressForm
              onGetDistricts={handleFetchDistricts}
              onGetWards={handleFetchWards}
              address={addressState}
              onResetForm={handleResetForm}
              isEditing={!!editingAddress}
            />
          </FormWrapper>
        </motion.div>
      )}
    </div>
  );
};

export default ShippingPage;
