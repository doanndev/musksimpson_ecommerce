'use client';
import { useAuth } from '@/hooks/useAuth';
import { type LoginFormData, loginSchema } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './styles.scss';

function LoginPage() {
  const {
    register,
    handleSubmit: handleSubmitForm,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const { login, googleLogin, facebookLogin, loginLoading, socialLoading } = useAuth();
  const handleSubmit = async (data: LoginFormData) => {
    login({
      email: data.identifier,
      password: data.password,
      provider: 'email',
    });
  };

  const handleGoogleLogin = async () => {
    googleLogin();
  };

  const handleFacebookLogin = async () => {
    facebookLogin();
  };

  return (
    <div className='form form__login container mt-4 h-[calc(100vh-32px)] p-0'>
      <Box component='form' id='form' onSubmit={handleSubmitForm(handleSubmit)} className='form__main'>
        <h3 className='form__main--heading'>Xin chào,</h3>
        <p className='form__main--text'>Đăng nhập</p>

        <TextField
          {...register('identifier')}
          fullWidth
          label='Email hoặc tên đăng nhập'
          error={!!errors.identifier}
          helperText={errors.identifier?.message}
          margin='normal'
          autoComplete='email'
          className='[&_.MuiInputBase-root]:!rounded-2xl'
        />
        <TextField
          {...register('password')}
          fullWidth
          label='Mật khẩu'
          type={showPassword ? 'text' : 'password'}
          error={!!errors.password}
          helperText={errors.password?.message}
          margin='normal'
          autoComplete='current-password'
          className='[&_.MuiInputBase-root]:!rounded-2xl'
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge='end'
                  aria-label='toggle password visibility'
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
          disabled={isSubmitting || loginLoading}
          sx={{ mt: 3, mb: 2, py: 1.5 }}
        >
          {loginLoading ? <CircularProgress size={24} /> : 'Đăng nhập'}
        </Button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Link href='/forgot-password' className='form__btn-forgot-password'>
            Quên mật khẩu ?
          </Link>
          <Link href='/register' className='form__btn-switch'>
            Đăng ký
          </Link>
        </div>

        <div className='form__footer'>
          <p className='form__text-line'>
            <span>Hoặc tiếp tục bằng</span>
          </p>

          <div className='form__login-other'>
            <Button
              variant='outlined'
              fullWidth
              className='flex items-center gap-2 rounded-2xl'
              color='gray'
              onClick={handleGoogleLogin}
              disabled={socialLoading.google}
            >
              {socialLoading.google ? (
                <CircularProgress size={24} />
              ) : (
                <Image src='/images/google-icon.png' alt='' width={24} height={24} />
              )}
              <p>Đăng nhập bằng Google</p>
            </Button>

            <Button
              variant='outlined'
              fullWidth
              className='flex items-center gap-2 rounded-2xl'
              color='gray'
              onClick={handleFacebookLogin}
              disabled={socialLoading.facebook}
            >
              {socialLoading.facebook ? (
                <CircularProgress size={24} />
              ) : (
                <Image src='/images/facebook-icon.png' alt='' width={32} height={32} />
              )}
              <p>Đăng nhập bằng Facebook</p>
            </Button>
          </div>

          <p className='form__footer-rules'>
            Bằng việc tiếp tục, bạn đã chấp nhận <a href='#!'>điều khoản sử dụng</a>
          </p>
        </div>
      </Box>
      <div className='form__thumbnail'>
        <img src='/images/form.svg' alt='' />
        <h4>Mua sắm tại Musksimpson</h4>
        <p>Siêu ưu đãi mỗi ngày</p>
      </div>
    </div>
  );
}

export default LoginPage;
