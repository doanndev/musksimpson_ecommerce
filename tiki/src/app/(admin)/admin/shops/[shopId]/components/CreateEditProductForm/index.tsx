import { ProductCreateInputSchema } from '@/api/products/schema';
import ImageUploader from '@/components/ui/admin/ImageUploader';
import { zodResolver } from '@hookform/resolvers/zod';
import { Add, Remove } from '@mui/icons-material';
import { Button, FormLabel, Paper, Stack, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import 'react-quill-new/dist/quill.snow.css';
import type { z } from 'zod';

import ReactQuill from 'react-quill-new';

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
};

const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'link', 'image'];

type ProductFormData = z.infer<typeof ProductCreateInputSchema>;

interface CreateEditProductFormProps {
  onSubmit: (data: ProductFormData) => void;
  defaultValues?: ProductFormData;
  isEditing?: boolean;
  categories: { value: string; label: string }[];
  shopId: string;
}

export default function CreateEditProductForm({
  onSubmit,
  defaultValues,
  isEditing = false,
  categories,
  shopId,
}: CreateEditProductFormProps) {
  console.log({ shopId });
  const { control, handleSubmit, setValue, watch } = useForm<ProductFormData>({
    resolver: zodResolver(ProductCreateInputSchema),
    defaultValues: defaultValues || {
      name: '',
      description: '',
      old_price: 0,
      new_price: 0,
      stock: 0,
      category_id: '',
      shop_id: shopId,
      images: [],
    },
  });

  const stock = watch('stock');

  const handleImagesChange = (urls: string[]) => {
    setValue(
      'images',
      urls.map((url) => ({ url, is_primary: false }))
    );
  };

  const handleEditorChange = (content: string) => {
    setValue('description', content);
  };

  const handleIncrementStock = () => {
    setValue('stock', stock + 1);
  };

  const handleDecrementStock = () => {
    if (stock > 0) {
      setValue('stock', stock - 1);
    }
  };

  return (
    <Stack px={3} py={5} gap={2}>
      <Typography variant='h4' fontWeight='bold' mb={3}>
        {isEditing ? 'Update Product' : 'Create Product'}
      </Typography>

      <Paper elevation={3} sx={{ borderRadius: '24px', p: 3, bgcolor: 'white' }}>
        <Typography variant='h6' fontWeight='bold' mb={2}>
          Basic Information
        </Typography>
        <Stack gap={3}>
          <Controller
            name='name'
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label='Product Name'
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                variant='outlined'
                sx={{ borderRadius: '12px' }}
              />
            )}
          />
          <FormLabel>Description</FormLabel>
          <Controller
            name='description'
            control={control}
            render={({ field, fieldState }) => (
              <>
                <ReactQuill
                  value={field.value || ''}
                  onChange={handleEditorChange}
                  modules={modules}
                  formats={formats}
                  placeholder='Write product description...'
                  style={{ height: '200px', marginBottom: '40px' }}
                />
                {fieldState.error && (
                  <Typography color='error' variant='caption'>
                    {fieldState.error.message}
                  </Typography>
                )}
              </>
            )}
          />
        </Stack>
      </Paper>

      <Paper elevation={3} sx={{ borderRadius: '24px', p: 3, bgcolor: 'white' }}>
        <Typography variant='h6' fontWeight='bold' mb={2}>
          Images
        </Typography>
        <ImageUploader onImagesChange={handleImagesChange} />
      </Paper>

      <Paper elevation={3} sx={{ borderRadius: '24px', p: 3, bgcolor: 'white' }}>
        <Typography variant='h6' fontWeight='bold' mb={2}>
          Price and Stock
        </Typography>
        <Stack gap={3}>
          <Controller
            name='old_price'
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label='Old Price'
                type='number'
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                variant='outlined'
                sx={{ borderRadius: '12px' }}
              />
            )}
          />
          <Controller
            name='new_price'
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label='New Price'
                type='number'
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                variant='outlined'
                sx={{ borderRadius: '12px' }}
              />
            )}
          />
          <Stack direction='row' gap={2} alignItems='center' sx={{ width: '250px' }}>
            <Button variant='contained' onClick={handleDecrementStock} sx={{ minWidth: '40px', borderRadius: '8px' }}>
              <Remove />
            </Button>
            <Controller
              name='stock'
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label='Stock'
                  type='number'
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  variant='outlined'
                  sx={{ borderRadius: '12px' }}
                />
              )}
            />
            <Button variant='contained' onClick={handleIncrementStock} sx={{ minWidth: '40px', borderRadius: '8px' }}>
              <Add />
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Paper elevation={3} sx={{ borderRadius: '24px', p: 3, bgcolor: 'white' }}>
        <Typography variant='h6' fontWeight='bold' mb={2}>
          Category
        </Typography>
        <Stack gap={3}>
          <Controller
            name='category_id'
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label='Category'
                fullWidth
                SelectProps={{ native: true }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                variant='outlined'
                sx={{ borderRadius: '12px' }}
              >
                <option value=''>Select a category</option>
                {categories.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            )}
          />
          <Controller
            name='shop_id'
            control={control}
            defaultValue={shopId}
            render={({ field }) => (
              <TextField
                {...field}
                label='Shop ID'
                fullWidth
                disabled
                variant='outlined'
                sx={{ borderRadius: '12px' }}
              />
            )}
          />
        </Stack>
      </Paper>

      <Stack direction='row' gap={2} mt={3}>
        <Button
          variant='contained'
          color='primary'
          onClick={handleSubmit(onSubmit)}
          sx={{ borderRadius: '12px', bgcolor: 'blue.600', '&:hover': { bgcolor: 'blue.700' } }}
        >
          {isEditing ? 'Update' : 'Create'}
        </Button>
        <Button variant='outlined' color='inherit' onClick={() => window.history.back()} sx={{ borderRadius: '12px' }}>
          Cancel
        </Button>
      </Stack>
    </Stack>
  );
}
