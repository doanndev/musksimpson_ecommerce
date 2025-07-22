'use client';

import { resetPasswordRequest } from '@/api/auth/request';
import theme from '@/theme';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Schema validation với Zod
const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function AdminResetPasswordPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const { mutate: resetPassword, isPending: isLoading } = useMutation({
    mutationFn: resetPasswordRequest,
    onSuccess: () => {
      toast.success('Password reset successfully. Please login.');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to reset password');
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!userId || !token) {
      toast.error('Invalid reset link');
      return;
    }
    resetPassword({ userId, token, password: data.password });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-gray-100'>
        <Box className='w-full max-w-md animate-fade-in rounded-lg bg-white p-8 shadow-card'>
          <Typography variant='h5' className='mb-6 text-center text-gray-800'>
            Reset Password
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label='New Password'
              type='password'
              fullWidth
              margin='normal'
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              className='[&_.MuiInputBase-root]:!rounded-2xl'
            />
            <TextField
              label='Confirm Password'
              type='password'
              fullWidth
              margin='normal'
              {...register('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              className='[&_.MuiInputBase-root]:!rounded-2xl'
            />
            <Button
              type='submit'
              variant='contained'
              color='primary'
              fullWidth
              disabled={isLoading || !userId || !token}
              className='[&_.MuiInputBase-root]:!rounded-2xl'
            >
              {isLoading ? <CircularProgress size={24} color='inherit' /> : 'Reset Password'}
            </Button>
          </form>
          <Button
            component={Link}
            href='/admin/login'
            className='!mt-4 w-full text-blue-600 hover:underline'
            variant='text'
          >
            Back to Login
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
