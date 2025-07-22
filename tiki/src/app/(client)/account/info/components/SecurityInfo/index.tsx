'use client';

import { Icons } from '@/assets/icons';
import { HStack } from '@/components/utils/h-stack';
import { VStack } from '@/components/utils/v-stack';
import { Box, Button, Typography } from '@mui/material';

export default function SecurityInfo() {
  return (
    <Box className='mt-6 rounded-2xl bg-white p-6'>
      <Typography variant='h6' className='!mb-4 font-semibold'>
        Bảo mật
      </Typography>
      <VStack spacing={16}>
        <HStack justify='between'>
          <HStack spacing={8} className='min-w-[180px] text-start text-sm'>
            <Icons.look />
            Thiết lập mật khẩu
          </HStack>
          <Button size='small' variant='outlined'>
            Cập nhật
          </Button>
        </HStack>
        <HStack justify='between'>
          <HStack spacing={8} className='min-w-[180px] text-start text-sm'>
            <Icons.shield />
            Thiết lập mã PIN
          </HStack>
          <Button size='small' variant='outlined'>
            Cập nhật
          </Button>
        </HStack>
        <HStack justify='between'>
          <HStack spacing={8} className='min-w-[180px] text-start text-sm'>
            <Icons.trash />
            Yêu cầu xóa tài khoản
          </HStack>
          <Button size='small' variant='outlined'>
            Cập nhật
          </Button>
        </HStack>
      </VStack>
      {/* <Button
        variant='outlined'
        startIcon={<Icons.shield />}
        className='w-full'
        onClick={() => console.log('Liên kết mạng xã hội')}
      >
        Liên kết mạng xã hội
      </Button> */}
    </Box>
  );
}
