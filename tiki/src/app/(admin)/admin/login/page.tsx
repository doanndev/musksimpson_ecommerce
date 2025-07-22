'use client';

import { Icons } from '@/assets/icons';
import { useAuthAdmin } from '@/hooks/useAuthAdmin';
import theme from '@/theme';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, CircularProgress, Divider, TextField, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Schema validation với Zod
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const { login, loginLoading, googleLogin, facebookLogin, socialLoading } = useAuthAdmin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login({ ...data, provider: 'email' });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-gray-100'>
        <Box className='w-full max-w-md animate-fade-in rounded-3xl bg-white p-8 shadow-card'>
          <Typography variant='h5' className='mb-6 text-center text-gray-800'>
            Admin Login
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <TextField
              label='Email'
              fullWidth
              margin='normal'
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              className='[&_.MuiInputBase-root]:!rounded-2xl'
            />
            <TextField
              label='Password'
              type='password'
              fullWidth
              margin='normal'
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              className='[&_.MuiInputBase-root]:!rounded-2xl'
            />
            <Button
              type='submit'
              variant='contained'
              color='primary'
              fullWidth
              disabled={loginLoading}
              className='[&_.MuiInputBase-root]:!rounded-2xl'
            >
              {loginLoading ? <CircularProgress size={24} color='inherit' /> : 'Login'}
            </Button>
          </form>
          <Divider className='py-4'>OR</Divider>
          <Box className='flex gap-4'>
            <Button
              onClick={googleLogin}
              disabled={socialLoading.google}
              variant='outlined'
              startIcon={<Icons.google />}
              className='flex-1 border-gray-300 hover:bg-gray-50'
            >
              {socialLoading.google ? <CircularProgress size={20} /> : 'Google'}
            </Button>
            <Button
              onClick={facebookLogin}
              disabled={socialLoading.facebook}
              variant='outlined'
              startIcon={<Icons.facebook className='mr-1 scale-[1.75]' />}
              className='flex-1 border-gray-300 hover:bg-gray-50'
            >
              {socialLoading.facebook ? <CircularProgress size={20} /> : 'Facebook'}
            </Button>
          </Box>
          <Button
            component={Link}
            href='/admin/forgot-password'
            className='!mt-4 w-full text-blue-600 hover:underline'
            variant='text'
          >
            Forgot Password?
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
