'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, CircularProgress, TextField } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { findUserById, updateUser } from '@/api/user/request';
import { queryClient } from '@/app/providers';
import { formatPhone, normalizePhone } from '@/components/utils/phone';
import {
  type UpdateUserFormData as EditUserFormData,
  updateUserSchema as editUserSchema,
} from '@/lib/validations/auth';

function EditProfilePage() {
  const { uuid } = useParams();
  const userId = uuid as string;
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Khởi tạo form và xác thực bằng Zod
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      username: '',
      full_name: '',
      phone_number: '',
      day_of_birth: '',
    },
  });

  const phoneInput = watch('phone_number');

  useEffect(() => {
    const formatted = formatPhone(phoneInput);
    if (formatted !== phoneInput) {
      setValue('phone_number', formatted);
    }
  }, [phoneInput, setValue]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await findUserById({ userId });

        reset({
          username: user.username || '',
          full_name: user.full_name || '',
          phone_number: user.phone_number || '',
          day_of_birth: user.day_of_birth?.slice(0, 10) || '',
        });
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu người dùng:', error);
        toast.error('Không thể tải dữ liệu người dùng!');
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [userId, reset]);

  // Mutation cập nhật thông tin người dùng
  const { mutate: updateUserMutation } = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: EditUserFormData }) =>
      updateUser({ userId: userId }, { data: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Cập nhật thành công!');
      router.push('/admin/users');
    },
    onError: (error) => {
      console.error('Lỗi cập nhật người dùng:', error);
      toast.error('Cập nhật thất bại!');
    },
  });
  const onSubmit = (data: EditUserFormData) => {
    const normalizedData = {
      ...data,
      phone_number: normalizePhone(data.phone_number),
    };
    updateUserMutation({ userId, data: normalizedData });
  };

  if (loading) return <p>Đang tải dữ liệu người dùng...</p>;

  return (
    <div className='form form__login container mt-4 h-[calc(100vh-32px)] p-0'>
      <Box component='form' onSubmit={handleSubmit(onSubmit)} className='form__main'>
        <p className='form__main--text'>Chỉnh sửa thông tin</p>

        <TextField
          {...register('username')}
          label='Tên đăng nhập'
          fullWidth
          margin='normal'
          autoComplete='username'
          InputLabelProps={{ shrink: true }}
          error={!!errors.username}
          helperText={errors.username?.message}
          className='[&_.MuiInputBase-root]:!rounded-2xl'
        />

        <TextField
          {...register('full_name')}
          label='Họ và tên'
          fullWidth
          margin='normal'
          autoComplete='name'
          InputLabelProps={{ shrink: true }}
          error={!!errors.full_name}
          helperText={errors.full_name?.message}
          className='[&_.MuiInputBase-root]:!rounded-2xl'
        />

        <TextField
          {...register('phone_number')}
          label='Số điện thoại'
          fullWidth
          margin='normal'
          autoComplete='tel'
          InputLabelProps={{ shrink: true }}
          error={!!errors.phone_number}
          helperText={errors.phone_number?.message}
          className='[&_.MuiInputBase-root]:!rounded-2xl'
        />

        <TextField
          {...register('day_of_birth')}
          label='Ngày sinh'
          type='date'
          fullWidth
          margin='normal'
          InputLabelProps={{ shrink: true }}
          error={!!errors.day_of_birth}
          helperText={errors.day_of_birth?.message}
          className='[&_.MuiInputBase-root]:!rounded-2xl'
        />

        <Button
          type='submit'
          fullWidth
          variant='contained'
          size='large'
          disabled={isSubmitting}
          sx={{ mt: 3, mb: 2, py: 1.5 }}
        >
          {isSubmitting ? <CircularProgress size={24} /> : 'Cập nhật'}
        </Button>
      </Box>
    </div>
  );
}

export default EditProfilePage;
