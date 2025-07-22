'use client';
import type { OrderStatusEnum } from '@/api/orders/type';
import { Box, Button, CircularProgress, Modal, Typography } from '@mui/material';
import React from 'react';
import { getStatusColor } from '../../libs/utils';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  status?: OrderStatusEnum;
  isLoading?: boolean;
}

const ModalChangeStatus = ({ open, onClose, onConfirm, status, isLoading }: Props) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: '#ffffff',
          borderRadius: '24px',
          textAlign: 'center',
          p: 4,
        }}
      >
        <Typography variant='h6' sx={{ mb: 2 }}>
          Xác nhận thay đổi trạng thái
        </Typography>
        <Typography sx={{ mb: 3 }}>
          Bạn có chắc muốn thay đổi trạng thái thành <strong style={{ color: getStatusColor(status) }}>{status}</strong>
          ?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant='outlined' fullWidth onClick={onClose} sx={{ borderRadius: '8px' }}>
            Hủy
          </Button>
          <Button variant='contained' fullWidth color='primary' onClick={onConfirm} sx={{ borderRadius: '8px' }}>
            {isLoading ? <CircularProgress size={20} /> : 'Xác nhận'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalChangeStatus;
