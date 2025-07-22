'use client';

import { useCategoriesQuery } from '@/api/categories/query';
import { useProductByIdQuery } from '@/api/products/query';
import { ProductCreateInputSchema } from '@/api/products/schema';
import ImageUploader from '@/components/ui/admin/ImageUploader';
import { FormWrapper, SelectField, TextAreaField, TextField } from '@/components/ui/common/forms';
import { zodResolver } from '@hookform/resolvers/zod';
import { Add, Remove } from '@mui/icons-material';
import { Button, Paper, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import type { z } from 'zod';

interface Props {
  shopId?: string;
  productId?: string;
}

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

export default function CreateEditProductForm({ shopId, productId }: Props) {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(ProductCreateInputSchema),
    defaultValues: {
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

  const { data: product } = useProductByIdQuery({ productId: productId! }, { enabled: !!productId });
  const { data: categories } = useCategoriesQuery({ limit: 100 }, { enabled: !!shopId });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description,
        old_price: product.old_price ?? 0,
        new_price: product.new_price ?? 0,
        stock: product.stock,
        category_id: product.category_id,
        shop_id: product.shop?.uuid,
        images: product.images,
      });
    }
  }, [product]);

  const { setValue, watch } = form;
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

  const handleSubmit = async (data: ProductFormData) => {
    console.log(data);
  };

  return (
    <FormWrapper form={form} onSubmit={handleSubmit}>
      <Stack px={3} py={5} gap={2}>
        <Typography variant='h4' fontWeight='bold' mb={3}>
          {productId ? 'Update Product' : 'Create Product'}
        </Typography>

        <Paper elevation={3} sx={{ borderRadius: '24px', p: 3, bgcolor: 'white' }}>
          <Typography variant='h6' fontWeight='bold' mb={2}>
            Basic Information
          </Typography>
          <Stack gap={3}>
            <TextField control={form.control} name='name' label='Product Name' placeLabel='inside' size='medium' />
            <TextAreaField
              control={form.control}
              name='description'
              label='Description'
              placeLabel='outside'
              size='medium'
              onChange={(e) => handleEditorChange(e.target.value)}
            >
              <ReactQuill
                value={form.getValues('description') || ''}
                onChange={handleEditorChange}
                modules={modules}
                formats={formats}
                placeholder='Write product description...'
                style={{ height: '200px', marginBottom: '40px' }}
              />
            </TextAreaField>
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
            <TextField
              control={form.control}
              name='old_price'
              label='Old Price'
              type='number'
              placeLabel='inside'
              size='medium'
            />
            <TextField
              control={form.control}
              name='new_price'
              label='New Price'
              type='number'
              placeLabel='inside'
              size='medium'
            />
            <Stack direction='row' gap={2} alignItems='center' sx={{ width: '250px' }}>
              <Button variant='contained' onClick={handleDecrementStock} sx={{ minWidth: '40px', borderRadius: '8px' }}>
                <Remove />
              </Button>
              <TextField
                control={form.control}
                name='stock'
                label='Stock'
                type='number'
                placeLabel='inside'
                size='medium'
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
            <SelectField control={form.control} name='category_id' label='Category' placeLabel='inside' size='medium'>
              <option value=''>Select a category</option>
              {categories?.map((option) => (
                <option key={option.uuid} value={option.uuid}>
                  {option.name}
                </option>
              ))}
            </SelectField>
            <TextField
              control={form.control}
              name='shop_id'
              label='Shop ID'
              placeLabel='inside'
              size='medium'
              disabled
            />
          </Stack>
        </Paper>

        <Stack direction='row' gap={2} mt={3}>
          <Button
            type='submit'
            variant='contained'
            color='primary'
            sx={{ borderRadius: '12px', bgcolor: 'blue.600', '&:hover': { bgcolor: 'blue.700' } }}
          >
            {productId ? 'Update' : 'Create'}
          </Button>
          <Button
            variant='outlined'
            color='inherit'
            onClick={() => window.history.back()}
            sx={{ borderRadius: '12px' }}
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
    </FormWrapper>
  );
}
