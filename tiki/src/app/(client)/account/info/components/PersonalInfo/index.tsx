'use client';

import { useUpdateUserMutation, useUploadAvatarMutation } from '@/api/user/query';
import type { UserIdParam, UserUpdateInput } from '@/api/user/type';
import { FormWrapper, SelectField, TextField } from '@/components/ui/common/forms';
import { HStack } from '@/components/utils/h-stack';
import { VStack } from '@/components/utils/v-stack';
import { onMutateError } from '@/lib/utils';
import { PersonalInfoSchema, type PersonalInfoType } from '@/lib/validations/account';
import { useAuthStore } from '@/stores/authStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, Box, Button, CircularProgress } from '@mui/material';
import dayjs from 'dayjs';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface PersonalInfoProps {
  initialData: PersonalInfoType;
}

const PersonalInfo = ({ initialData }: PersonalInfoProps) => {
  const { user } = useAuthStore();
  const [avatar, setAvatar] = useState<string | null>(initialData.avatar || null);
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<PersonalInfoType>({
    resolver: zodResolver(PersonalInfoSchema),
    defaultValues: initialData,
  });

  const { mutate: updateUser, isPending: isUpdatingUser } = useUpdateUserMutation({
    onSuccess: () => {
      toast.success('Cập nhật thông tin cá nhân thành công');
    },
    onError: onMutateError,
  });

  const { mutate: uploadAvatar, isPending: isUploadingAvatar } = useUploadAvatarMutation({
    onSuccess: () => {
      toast.success('Cập nhật ảnh đại diện thành công');
      setFile(null);
    },
    onError: onMutateError,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAvatar(URL.createObjectURL(selectedFile));
    }
  };

  const handleSaveAvatar = async () => {
    if (!file || !user?.uuid) return;

    try {
      const storage = getStorage();
      const storageRef = ref(storage, `avatars/${user.uuid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      await updateUser({ userId: user.uuid, avatar: downloadURL });
      await uploadAvatar({ userId: user.uuid, file });
    } catch (error) {
      toast.error('Tải ảnh đại diện lên Firebase thất bại');
      console.error(error);
    }
  };

  const onSubmit: SubmitHandler<PersonalInfoType> = (data) => {
    const formattedData: UserIdParam & Partial<UserUpdateInput> = {
      userId: user?.uuid || '',
      full_name: data?.fullName,
      username: data?.nickname ?? '',
      gender: data.gender === 'Nam' ? true : false,
      day_of_birth: dayjs()
        .set('year', data.birthYear)
        .set('month', data.birthMonth - 1)
        .set('date', data.birthDay)
        .format('YYYY-MM-DD'),
    };
    updateUser(formattedData);
  };

  return (
    <FormWrapper form={form} onSubmit={onSubmit} className='min-h-[432px] rounded-2xl bg-white p-6'>
      <HStack align='start'>
        <Box className='mb-6 flex items-center space-x-4'>
          <Button
            variant='outlined'
            color='primary'
            onClick={() => document.getElementById('avatar-upload')?.click()}
            className='!p-0 !rounded-full !border-[4px]'
            disabled={isUploadingAvatar}
          >
            <Avatar src={avatar || '/default-avatar.jpg'} className='!h-20 !w-20' />
            {isUploadingAvatar && <CircularProgress size={20} className='absolute' />}
            <input
              id='avatar-upload'
              type='file'
              accept='image/*'
              className='hidden'
              hidden
              onChange={handleFileChange}
            />
          </Button>
          {file && (
            <Button variant='contained' color='primary' onClick={handleSaveAvatar} disabled={isUploadingAvatar}>
              Lưu ảnh đại diện
            </Button>
          )}
        </Box>
        <VStack className='flex-1'>
          <TextField
            name='fullName'
            label='Họ và tên'
            control={form.control}
            defaultValue={initialData.fullName}
            placeLabel='inside'
            size='small'
          />
          <TextField
            name='nickname'
            label='Biệt danh'
            control={form.control}
            defaultValue={initialData.nickname}
            placeLabel='inside'
            size='small'
          />
        </VStack>
      </HStack>
      <Box className='mb-4 flex space-x-2'>
        <TextField
          name='birthDay'
          size='small'
          label='Ngày'
          type='number'
          control={form.control}
          defaultValue={initialData.birthDay}
          placeLabel='inside'
          className='w-1/3'
        />
        <TextField
          name='birthMonth'
          size='small'
          label='Tháng'
          type='number'
          control={form.control}
          defaultValue={initialData.birthMonth}
          placeLabel='inside'
          className='w-1/3'
        />
        <TextField
          name='birthYear'
          size='small'
          label='Năm'
          type='number'
          control={form.control}
          defaultValue={initialData.birthYear}
          placeLabel='inside'
          className='w-1/3'
        />
      </Box>
      <SelectField
        name='gender'
        label='Giới tính'
        control={form.control}
        defaultValue={initialData.gender}
        placeLabel='inside'
        size='small'
      >
        {['Nam', 'Nữ', 'Khác'].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </SelectField>
      {/* <TextField
          name="address"
          label="Địa chỉ"
          control={form.control}
          defaultValue={initialData.address}
          placeLabel="outside"
          labelClassName="font-semibold"
        /> */}
      <Button type='submit' variant='contained' color='primary' className='!mt-4' disabled={isUpdatingUser}>
        Lưu thông tin cá nhân
      </Button>
    </FormWrapper>
  );
};

export default PersonalInfo;
