import { WarningAmber } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export default function ConfirmModal({ open, onClose, onConfirm, title, description }: ConfirmModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      sx={{ '& .MuiDialog-paper': { borderRadius: '24px' } }}
    >
      <DialogTitle sx={{ bgcolor: 'white', borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}>
        <Stack direction='column' alignItems='center' gap={1}>
          <WarningAmber color='warning' sx={{ fontSize: '100px' }} />
          <Typography variant='h6' fontWeight='bold'>
            {title}
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ bgcolor: 'white' }}>
        <Typography variant='body1' color='text.secondary' textAlign='center'>
          {description}
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          bgcolor: 'white',
          p: 2,
          borderBottomLeftRadius: '24px',
          borderBottomRightRadius: '24px',
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <Button onClick={onClose} fullWidth color='inherit' sx={{ borderRadius: '12px' }}>
          Hủy bỏ
        </Button>
        <Button
          onClick={onConfirm}
          variant='contained'
          color='error'
          fullWidth
          sx={{ borderRadius: '12px', bgcolor: 'red.600', '&:hover': { bgcolor: 'red.700' } }}
        >
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
}
