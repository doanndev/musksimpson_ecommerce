'use client';

import { forgotPasswordRequest } from '@/api/auth/request';
import theme from '@/theme';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Schema validation với Zod
const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function AdminForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { mutate: forgotPassword, isPending: isLoading } = useMutation({
    mutationFn: forgotPasswordRequest,
    onSuccess: (data) => {
      toast.success(`A password reset link has been sent to ${data.email}`);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to send reset link');
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword(data);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-gray-100'>
        <Box className='w-full max-w-md animate-fade-in rounded-lg bg-white p-8 shadow-card'>
          <Typography variant='h5' className='mb-6 text-center text-gray-800'>
            Forgot Password
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label='Email'
              fullWidth
              margin='normal'
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              className='[&_.MuiInputBase-root]:!rounded-2xl'
            />
            <Button type='submit' variant='contained' color='primary' fullWidth disabled={isLoading} className='!mt-4'>
              {isLoading ? <CircularProgress size={24} color='inherit' /> : 'Send Reset Link'}
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
