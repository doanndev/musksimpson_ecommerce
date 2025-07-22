import ImageUploader from '@/components/ui/admin/ImageUploader';
import { Stack, Typography } from '@mui/material';

interface ShopLogoFormProps {
  onImagesChange: (urls: string[]) => void;
}

export function ShopLogoForm({ onImagesChange }: ShopLogoFormProps) {
  return (
    <Stack gap={3}>
      <Typography variant='h6' fontWeight='bold'>
        Shop Logo
      </Typography>
      <ImageUploader onImagesChange={onImagesChange} />
    </Stack>
  );
}
