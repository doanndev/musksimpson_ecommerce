'use client';
import { RoleEnum } from '@/lib/constants/role';
import { Box, Button, Modal, Typography } from '@mui/material';
import React from 'react';

interface ModalChangeRoleProps {
  open: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
  roleId?: string;
}

const ModalChangeRole: React.FC<ModalChangeRoleProps> = ({ open, handleClose, handleConfirm, roleId }) => {
  const roleName =
    roleId === RoleEnum.ADMIN
      ? 'Quản trị viên'
      : roleId === RoleEnum.USER
        ? 'Khách hàng'
        : roleId === RoleEnum.SELLER
          ? 'Người bán'
          : '';

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          p: 4,
        }}
      >
        <Typography variant='h6' sx={{ mb: 2 }}>
          Xác nhận thay đổi vai trò
        </Typography>
        <Typography sx={{ mb: 3 }}>
          Bạn có chắc muốn thay đổi vai trò thành <strong>{roleName}</strong>?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant='outlined' onClick={handleClose} sx={{ borderRadius: '8px' }}>
            Hủy
          </Button>
          <Button variant='contained' color='primary' onClick={handleConfirm} sx={{ borderRadius: '8px' }}>
            Xác nhận
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalChangeRole;
