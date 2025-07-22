'use client';
import { Box, Button, Modal, Typography } from '@mui/material';
import React from 'react';

interface ModalRemoveProps {
  open: boolean;
  selectedItems: string[];
  handleClose: () => void;
  handleRemove: () => void;
}

const ModalRemove: React.FC<ModalRemoveProps> = ({ open, selectedItems, handleClose, handleRemove }) => {
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
          Xác nhận xóa
        </Typography>
        <Typography sx={{ mb: 3 }}>
          Bạn có chắc muốn {selectedItems.length > 1 ? 'xóa' : 'ẩn'} {selectedItems.length} người dùng?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant='outlined' onClick={handleClose} sx={{ borderRadius: '8px' }}>
            Hủy
          </Button>
          <Button variant='contained' color='error' onClick={handleRemove} sx={{ borderRadius: '8px' }}>
            Xóa
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalRemove;
