import type { ShopResponseType } from '@/api/shop/type';
import { LocationOn } from '@mui/icons-material';
import { Avatar, Box, Stack, Typography } from '@mui/material';

interface ShopInfoProps {
  shop?: ShopResponseType;
  totalProducts: number;
  totalOrders: number;
}

export default function ShopInfo({ shop, totalProducts, totalOrders }: ShopInfoProps) {
  return (
    <Stack direction='row' alignItems='center' gap={2} className='rounded-2xl bg-white p-4'>
      <Avatar src={shop?.logo || '/default-shop.png'} sx={{ width: 100, height: 100, borderRadius: '16px' }} />
      <Stack flex={1} gap={1}>
        <Typography variant='h5' fontWeight='bold'>
          {shop?.name || 'Shop Name'}
        </Typography>
        <Stack direction='row' alignItems='center' gap={1}>
          <LocationOn color='action' />
          <Typography variant='body2' color='text.secondary'>
            {shop?.address?.address || 'No address provided'}
          </Typography>
        </Stack>
        <Stack direction='row' gap={4} mt={1}>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Total Products
            </Typography>
            <Typography variant='h6' fontWeight='bold'>
              {totalProducts || 0}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Total Orders
            </Typography>
            <Typography variant='h6' fontWeight='bold'>
              {totalOrders || 0}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Status
            </Typography>
            <Typography variant='h6' fontWeight='bold' color={shop?.is_active ? 'success.main' : 'error.main'}>
              {shop?.is_active ? 'Active' : 'Inactive'}
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}
