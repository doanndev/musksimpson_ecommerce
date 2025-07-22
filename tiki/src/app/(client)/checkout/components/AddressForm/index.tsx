'use client';

import { SelectField, TextField } from '@/components/ui/common/forms';
import type { AddressFormData } from '@/lib/validations/address';
import { Checkbox, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface AddressState {
  provinces: any[];
  districts: any[];
  wards: any[];
}

interface Props {
  onGetDistricts: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onGetWards: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  address: AddressState;
  onResetForm: () => void;
  isEditing?: boolean;
}

export const AddressForm = ({ onGetDistricts, onGetWards, address, onResetForm, isEditing }: Props) => {
  const { control } = useFormContext<AddressFormData>();

  return (
    <div className='checkout__form checkout--bg-white'>
      <div className='checkout__form-container max-w-[800px]'>
        <TextField
          control={control}
          placeLabel='outside'
          size='small'
          name='fullName'
          label='Họ và tên'
          placeholder='Nhập họ và tên'
        />
        <TextField
          control={control}
          placeLabel='outside'
          size='small'
          name='phoneNumber'
          label='Điện thoại di động'
          placeholder='Nhập số điện thoại'
        />
        <SelectField
          control={control}
          placeLabel='outside'
          size='small'
          name='province_id'
          label='Tỉnh/Thành phố'
          onChange={onGetDistricts}
        >
          <option value='' disabled>
            Chọn Tỉnh/Thành phố
          </option>
          {address.provinces.map(({ ProvinceID, ProvinceName }: any) => (
            <option key={ProvinceID} value={ProvinceID}>
              {ProvinceName}
            </option>
          ))}
        </SelectField>
        <SelectField
          control={control}
          placeLabel='outside'
          size='small'
          name='district_id'
          label='Quận/Huyện'
          onChange={onGetWards}
          disabled={!address.districts.length}
        >
          <option value='' disabled>
            Chọn Quận/Huyện
          </option>
          {address.districts.map(({ DistrictID, DistrictName }: any) => (
            <option key={DistrictID} value={DistrictID}>
              {DistrictName}
            </option>
          ))}
        </SelectField>
        <SelectField
          control={control}
          placeLabel='outside'
          size='small'
          name='ward_code'
          label='Phường/Xã'
          disabled={!address.wards.length}
        >
          <option value='' disabled>
            Chọn Phường/Xã
          </option>
          {address.wards.map(({ WardCode, WardName }: any) => (
            <option key={WardCode} value={WardCode}>
              {WardName}
            </option>
          ))}
        </SelectField>
        <TextField
          control={control}
          placeLabel='outside'
          size='small'
          name='address'
          label='Địa chỉ'
          placeholder='Nhập địa chỉ cụ thể (số nhà, đường)'
        />
        <Controller
          name='typeAddress'
          control={control}
          render={({ field }) => (
            <FormControl component='fieldset' margin='normal'>
              <div className='flex items-center gap-32'>
                <FormLabel component='legend'>Loại địa chỉ</FormLabel>
                <RadioGroup {...field} row>
                  <FormControlLabel value='Nhà riêng' control={<Radio />} label='Nhà riêng / Chung cư' />
                  <FormControlLabel value='Công ty' control={<Radio />} label='Cơ quan / Công ty' />
                </RadioGroup>
              </div>
            </FormControl>
          )}
        />
        <Controller
          name='is_default'
          control={control}
          render={({ field }) => (
            <FormControl component='fieldset' margin='normal'>
              <div className='ml-[212px]'>
                <FormControlLabel
                  control={<Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                  label='Sử dụng địa chỉ này làm mặc định.'
                />
              </div>
            </FormControl>
          )}
        />

        <div className='ml-[212px] flex gap-4'>
          <button onClick={onResetForm} className='checkout__button checkout__button--secondary'>
            Hủy bỏ
          </button>
          <button className='checkout__button checkout__button--primary' type='submit'>
            {isEditing ? 'Cập nhật' : 'Giao đến địa chỉ này'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
