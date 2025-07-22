'use client';

import React, { useState } from 'react';

import { forgotPasswordRequest } from '@/api/auth/request';
import { type ForgotPasswordFormData, forgotPasswordSchema } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, CircularProgress, TextField } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import './styles.scss';

function ForgotPasswordPage() {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit: handleSubmitForm,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { mutate: forgotPassword, isPending: forgotPasswordLoading } = useMutation({
    mutationFn: forgotPasswordRequest,
    onSuccess: (data) => {
      setEmailSent(true);
      const expiresAt = new Date(data.expiresAt).getTime();
      const updateCountdown = () => {
        const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
        setCountdown(remaining);
        if (remaining <= 0) {
          setEmailSent(false);
          clearInterval(interval);
        }
      };
      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    },
    onError: () => {
      setEmailSent(false);
    },
  });

  const handleSubmit = async (data: ForgotPasswordFormData) => {
    forgotPassword(data);
  };

  return (
    <div className='form form__login !p-0 container mt-4 h-[calc(100vh-32px)]'>
      <Box id='form' className='form__main' component='form' onSubmit={handleSubmitForm(handleSubmit)}>
        <h3 className='form__main--heading'>Quên mật khẩu ?</h3>
        <p className='form__main--text'>Vui lòng nhập thông tin tài khoản để lấy lại mật khẩu</p>

        <TextField
          {...register('email')}
          fullWidth
          label='Email'
          error={!!errors.email}
          helperText={errors.email?.message}
          margin='normal'
          autoComplete='email'
          className='[&_.MuiInputBase-root]:!rounded-2xl'
        />

        <Button
          type='submit'
          fullWidth
          variant='contained'
          size='large'
          disabled={isSubmitting || forgotPasswordLoading || countdown !== null}
          sx={{ mt: 3, mb: 2, py: 1.5 }}
        >
          {forgotPasswordLoading ? (
            <CircularProgress size={24} />
          ) : countdown !== null ? (
            `Gửi lại (${Math.floor(countdown / 60)}:${(countdown % 60 < 10 ? '0' : '') + (countdown % 60)})`
          ) : (
            'Gửi đi'
          )}
        </Button>

        {emailSent && (
          <Alert severity='success' sx={{ mt: 2 }}>
            Email đã được gửi! Vui lòng kiểm tra hộp thư của bạn.
          </Alert>
        )}
      </Box>
      <div className='form__thumbnail'>
        <img src='/images/form.svg' alt='' />
        <h4>Mua sắm tại Musksimpson</h4>
        <p>Siêu ưu đãi mỗi ngày</p>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
