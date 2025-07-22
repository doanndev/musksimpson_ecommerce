'use client';

import { resetPasswordRequest, verifyTokenRequest } from '@/api/auth/request';
import { ROUTES } from '@/lib/routes';
import { onMutateError } from '@/lib/utils';
import { type ResetPasswordFormData, resetPasswordSchema } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Alert, Box, Button, CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import './styles.scss';

function ResetPasswordPage() {
  const { id, token } = useParams<{ id: string; token: string }>();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  const {
    register,
    handleSubmit: handleSubmitForm,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const { mutateAsync: verifyToken, isPending: isVerifyPending } = useMutation({
    mutationFn: () => verifyTokenRequest(id, token),
    onSuccess: (data) => {
      const expiresAt = new Date(data.expiresAt).getTime();
      const updateCountdown = () => {
        const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
        setCountdown(remaining);
        if (remaining <= 0) {
          setTokenError('Liên kết đặt lại mật khẩu đã hết hạn.');
          clearInterval(interval);
        }
      };
      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    },
    onError: (err: any) => {
      setTokenError('Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.');
      onMutateError(err);
    },
  });

  const { mutateAsync: resetPassword, isPending: isResetPending } = useMutation({
    mutationFn: resetPasswordRequest,
    onSuccess: () => {
      router.push(ROUTES.LOGIN);
    },
    onError: (err: any) => {
      setTokenError('Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.');
      onMutateError(err);
    },
  });

  useEffect(() => {
    verifyToken();
  }, [id, token, verifyToken]);

  const handleSubmit = async (data: ResetPasswordFormData) => {
    if (tokenError) return;
    await resetPassword({ userId: id, token, ...data });
  };

  return (
    <div className='form form__login !p-0 container mt-4 h-[calc(100vh-32px)]'>
      <Box id='form' className='form__main' component='form' onSubmit={handleSubmitForm(handleSubmit)}>
        <h3 className='form__main--heading'>Tạo mật khẩu mới?</h3>
        <p className='form__main--text'>Vui lòng nhập mật khẩu mới của bạn</p>

        {tokenError && (
          <Alert severity='error' sx={{ mt: 2 }}>
            {tokenError}
          </Alert>
        )}

        <TextField
          {...register('password')}
          fullWidth
          label='Mật khẩu'
          error={!!errors.password}
          helperText={errors.password?.message}
          margin='normal'
          autoComplete='new-password'
          className='[&_.MuiInputBase-root]:!rounded-2xl'
          type={showPassword ? 'text' : 'password'}
          disabled={!!tokenError || countdown === 0 || isVerifyPending}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge='end'
                  aria-label='toggle password visibility'
                  disabled={!!tokenError || countdown === 0 || isVerifyPending}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type='submit'
          fullWidth
          variant='contained'
          size='large'
          disabled={
            isSubmitting || isResetPending || isVerifyPending || !!tokenError || countdown === null || countdown <= 0
          }
          sx={{ mt: 3, mb: 2, py: 1.5 }}
        >
          {isResetPending || isVerifyPending ? (
            <CircularProgress size={24} />
          ) : (
            `Cập nhật (${Math.floor((countdown || 0) / 60)}:${((countdown || 0) % 60 < 10 ? '0' : '') + ((countdown || 0) % 60)})`
          )}
        </Button>
      </Box>

      <div className='form__thumbnail'>
        <img src='/images/form.svg' alt='Background Form' />
        <h4>Mua sắm tại Musksimpson</h4>
        <p>Siêu ưu đãi mỗi ngày</p>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
