'use client';
import { UserQueryKey, useUpdateUserMutation } from '@/api/user/query';
import { queryClient } from '@/app/providers';
import { Icons } from '@/assets/icons';
import { FormWrapper, TextField } from '@/components/ui/common/forms';
import { HStack } from '@/components/utils/h-stack';
import { VStack } from '@/components/utils/v-stack';
import { onMutateError } from '@/lib/utils';
import { ContactInfoSchema, type ContactInfoType } from '@/lib/validations/account';
import { useAuthStore } from '@/stores/authStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function ContactInfo({ initialData }: { initialData: ContactInfoType }) {
  const { user } = useAuthStore();
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  const form = useForm<ContactInfoType>({
    resolver: zodResolver(ContactInfoSchema),
    defaultValues: initialData,
  });

  const { mutate: updateUser, isPending: isUpdating } = useUpdateUserMutation({
    onSuccess: () => {
      toast.success('Cập nhật thông tin liên hệ thành công');
      setIsEditingPhone(false);
      setIsEditingEmail(false);
      queryClient.invalidateQueries({ queryKey: [UserQueryKey.CURRENT_USER] });
    },
    onError: onMutateError,
  });

  const onSubmitPhone = (data: ContactInfoType) => {
    updateUser({ userId: user?.uuid || '', phone_number: data.phone });
    form.reset({ ...initialData, phone: data.phone });
  };

  const onSubmitEmail = (data: ContactInfoType) => {
    updateUser({ userId: user?.uuid || '', email: data.email });
    form.reset({ ...initialData, email: data.email });
  };

  return (
    <Box className='rounded-2xl bg-white p-6'>
      <div className='space-y-4'>
        {/* Phone Section */}
        {isEditingPhone ? (
          <FormWrapper form={form} onSubmit={onSubmitPhone} className='flex items-center space-x-2'>
            <TextField
              name='phone'
              size='small'
              label='Số điện thoại'
              control={form.control}
              placeLabel='inside'
              fullWidth
              disabled={isUpdating}
            />
            <Button
              size='small'
              className='!h-[42px] !mt-[4px]'
              type='submit'
              variant='contained'
              color='primary'
              disabled={isUpdating}
            >
              Lưu
            </Button>
            <Button
              size='small'
              className='!h-[42px] !mt-[4px]'
              variant='outlined'
              onClick={() => setIsEditingPhone(false)}
              disabled={isUpdating}
            >
              Hủy
            </Button>
          </FormWrapper>
        ) : (
          <div className='flex items-center justify-between'>
            <HStack align='start' spacing={8}>
              <Icons.phone className='mt-1 text-gray-500' />
              <VStack className='text-sm'>
                <span>Số điện thoại</span>
                <span>{initialData.phone || 'Chưa cung cấp'}</span>
              </VStack>
            </HStack>
            <Button size='small' onClick={() => setIsEditingPhone(true)} variant='outlined' disabled={isUpdating}>
              Cập nhật
            </Button>
          </div>
        )}

        {/* Email Section */}
        {isEditingEmail ? (
          <FormWrapper form={form} onSubmit={onSubmitEmail} className='flex items-center space-x-2'>
            <TextField
              name='email'
              label='Email'
              size='small'
              control={form.control}
              placeLabel='inside'
              fullWidth
              disabled={isUpdating}
            />
            <Button
              size='small'
              className='!h-[42px] !mt-[4px]'
              type='submit'
              variant='contained'
              color='primary'
              disabled={isUpdating}
            >
              Lưu
            </Button>
            <Button
              size='small'
              className='!h-[42px] !mt-[4px]'
              variant='outlined'
              onClick={() => setIsEditingEmail(false)}
              disabled={isUpdating}
            >
              Hủy
            </Button>
          </FormWrapper>
        ) : (
          <div className='flex items-center justify-between'>
            <HStack align='start' spacing={8}>
              <Icons.email className='mt-1 text-gray-500' />
              <VStack className='text-sm'>
                <span>Email</span>
                <span>{initialData.email || 'Chưa cung cấp'}</span>
              </VStack>
            </HStack>
            <Button size='small' onClick={() => setIsEditingEmail(true)} variant='outlined' disabled={isUpdating}>
              Cập nhật
            </Button>
          </div>
        )}
      </div>
    </Box>
  );
}
