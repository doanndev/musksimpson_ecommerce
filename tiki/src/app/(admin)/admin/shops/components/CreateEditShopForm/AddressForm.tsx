'use client';

import { createAddressRequest } from '@/api/addresses/request';
import { AddressCreateInputSchema } from '@/api/addresses/schema';
import type { AddressCreateInput } from '@/api/addresses/type';
import type { UserResponseData } from '@/api/user/type';
import { FormWrapper, SelectField, TextField } from '@/components/ui/common/forms';
import { fetchDistricts, fetchProvinces, fetchWards } from '@/lib/ghn';
import { onMutateError } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { Controller, type UseFormSetValue, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface AddressState {
  provinces: any[];
  districts: any[];
  wards: any[];
}

interface Props {
  currentUser?: UserResponseData;
  openAddressDialog: boolean;
  refetchUser: () => void;
  setShopValue: UseFormSetValue<{
    name: string;
    is_active: boolean;
    description?: string | null | undefined;
    logo?: string | null | undefined;
    address_id?: number | null | undefined;
  }>;
  setOpenAddressDialog: (open: boolean) => void;
}

export const AddressForm = ({
  currentUser,
  openAddressDialog,
  refetchUser,
  setShopValue,
  setOpenAddressDialog,
}: Props) => {
  const [addressState, setAddressState] = useState({ provinces: [], districts: [], wards: [] });

  const form = useForm<AddressCreateInput>({
    resolver: zodResolver(AddressCreateInputSchema),
    defaultValues: {
      user_id: currentUser?.uuid || '',
      full_name: '',
      phone_number: '',
      address: '',
      province_id: undefined,
      district_id: undefined,
      ward_code: '',
      type_address: 'HOME',
      is_default: true,
    },
  });

  const createAddressMutation = useMutation({
    mutationFn: createAddressRequest,
    onSuccess: (newAddress) => {
      toast.success('Address created successfully!');
      // Refetch user data to update addresses
      refetchUser();
      // Set the new address as selected in the shop form
      setShopValue('address_id', newAddress.id);
      setOpenAddressDialog(false);
      form.reset();
    },
    onError: onMutateError,
  });

  const onAddressSubmit = (data: AddressCreateInput) => {
    console.log(data);
    if (!currentUser?.uuid) {
      toast.error('Please log in to save address.');
      return;
    }
    createAddressMutation.mutate({ ...data, user_id: currentUser.uuid });
  };

  // Load provinces on mount
  useEffect(() => {
    const loadProvinces = async () => {
      const provinces = await fetchProvinces();
      setAddressState((prev) => ({ ...prev, provinces }));
    };
    loadProvinces();
  }, []);

  const handleFetchDistricts = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const provinceId = Number(e.target.value);
    if (provinceId) {
      const districts = await fetchDistricts(provinceId);
      setAddressState((prev) => ({ ...prev, districts, wards: [] }));
      form.setValue('district_id', undefined);
      form.setValue('ward_code', '');
    }
  };

  const handleFetchWards = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const districtId = Number(e.target.value);
    if (districtId) {
      const wards = await fetchWards(districtId);
      setAddressState((prev) => ({ ...prev, wards }));
      form.setValue('ward_code', '');
    }
  };

  console.log({ values: form.getValues(), errors: form.formState.errors });

  return (
    <Dialog
      open={openAddressDialog}
      onClose={() => setOpenAddressDialog(false)}
      maxWidth='sm'
      fullWidth
      data-lenis-prevent
      sx={{ '& .MuiDialog-paper': { borderRadius: '24px' } }}
    >
      <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Thêm địa chỉ</DialogTitle>
      <DialogContent>
        <FormWrapper form={form} onSubmit={onAddressSubmit}>
          <div className='checkout__form checkout--bg-white'>
            <h2 className='checkout__form--heading !text-[20px] !font-semibold'>Địa chỉ giao hàng</h2>
            <div className='checkout__form-container max-w-[600px]'>
              <TextField
                control={form.control}
                placeLabel='outside'
                size='small'
                name='full_name'
                label='Họ và tên'
                placeholder='Nhập họ và tên'
              />
              <TextField
                control={form.control}
                placeLabel='outside'
                size='small'
                name='phone_number'
                label='Điện thoại di động'
                placeholder='Nhập số điện thoại'
              />
              <SelectField
                control={form.control}
                placeLabel='outside'
                size='small'
                name='province_id'
                label='Tỉnh/Thành phố'
                onChange={handleFetchDistricts}
              >
                <option value='' disabled>
                  Chọn Tỉnh/Thành phố
                </option>
                {addressState.provinces.map(({ ProvinceID, ProvinceName }: any) => (
                  <option key={ProvinceID} value={ProvinceID}>
                    {ProvinceName}
                  </option>
                ))}
              </SelectField>
              <SelectField
                control={form.control}
                placeLabel='outside'
                size='small'
                name='district_id'
                label='Quận/Huyện'
                onChange={handleFetchWards}
                disabled={!addressState.districts.length}
              >
                <option value='' disabled>
                  Chọn Quận/Huyện
                </option>
                {addressState.districts.map(({ DistrictID, DistrictName }: any) => (
                  <option key={DistrictID} value={DistrictID}>
                    {DistrictName}
                  </option>
                ))}
              </SelectField>
              <SelectField
                control={form.control}
                placeLabel='outside'
                size='small'
                name='ward_code'
                label='Phường/Xã'
                disabled={!addressState.wards.length}
              >
                <option value='' disabled>
                  Chọn Phường/Xã
                </option>
                {addressState.wards.map(({ WardCode, WardName }: any) => (
                  <option key={WardCode} value={WardCode}>
                    {WardName}
                  </option>
                ))}
              </SelectField>
              <TextField
                control={form.control}
                placeLabel='outside'
                size='small'
                name='address'
                label='Địa chỉ'
                placeholder='Nhập địa chỉ cụ thể (số nhà, đường)'
              />
              <Controller
                name='type_address'
                defaultValue='HOME'
                control={form.control}
                render={({ field }) => (
                  <FormControl component='fieldset' margin='normal'>
                    <FormLabel component='legend'>Loại địa chỉ</FormLabel>
                    <RadioGroup {...field} row>
                      <FormControlLabel value='HOME' control={<Radio />} label='Nhà riêng / Chung cư' />
                      <FormControlLabel value='WORK' control={<Radio />} label='Cơ quan / Công ty' />
                    </RadioGroup>
                    {form.formState.errors.type_address && (
                      <FormHelperText className='!text-red-500'>
                        {form.formState.errors.type_address.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </div>
          </div>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenAddressDialog(false)} color='inherit'>
              Hủy bỏ
            </Button>
            <Button
              type='submit'
              variant='contained'
              color='primary'
              form='form-submit-shop'
              sx={{ borderRadius: '12px', bgcolor: 'blue.600', '&:hover': { bgcolor: 'blue.700' } }}
            >
              Lưu
            </Button>
          </DialogActions>
        </FormWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default AddressForm;
