'use client';

import { Box } from '@mui/material';
import CreateEditShopForm from '../components/CreateEditShopForm';

export default function CreateShopPage() {
  return (
    <Box sx={{ p: 3 }}>
      <CreateEditShopForm isEditing={false} />
    </Box>
  );
}
