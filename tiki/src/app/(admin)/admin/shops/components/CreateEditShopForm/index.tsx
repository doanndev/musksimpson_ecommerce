'use client';
import { ShopQueryKey } from '@/api/shop/query';
import { createShopRequest, updateShopRequest } from '@/api/shop/request';
import { ShopCreateInputSchema } from '@/api/shop/schema';
import type { ShopResponseType } from '@/api/shop/type';
import { useCurrentUserQuery } from '@/api/user/query';
import ImageUploader from '@/components/ui/admin/ImageUploader';
import { FormWrapper, SelectField, TextAreaField, TextField } from '@/components/ui/common/forms';
import { onMutateError } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import AddressForm from './AddressForm';

type ShopFormData = z.infer<typeof ShopCreateInputSchema>;

interface CreateEditShopFormProps {
  isEditing?: boolean;
  editingShop?: ShopResponseType;
}

export default function CreateEditShopForm({ isEditing = false, editingShop }: CreateEditShopFormProps) {
  const queryClient = useQueryClient();
  const [openAddressDialog, setOpenAddressDialog] = useState(false);

  // Fetch current user data to get addresses
  const { data: currentUser, isLoading: isUserLoading, refetch: refetchUser } = useCurrentUserQuery();

  const form = useForm<ShopFormData>({
    resolver: zodResolver(ShopCreateInputSchema),
    defaultValues: editingShop
      ? {
          name: editingShop.name || '',
          description: editingShop.description || '',
          logo: editingShop.logo || '',
          address_id: editingShop.address_id || null,
          is_active: editingShop.is_active ?? true,
        }
      : {
          name: '',
          description: '',
          logo: '',
          address_id: null,
          is_active: true,
        },
  });

  const { setValue: setShopValue, reset: resetShopForm } = form;

  const createShopMutation = useMutation({
    mutationFn: createShopRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ShopQueryKey.SHOPS] });
      resetShopForm();
    },
    onError: onMutateError,
  });

  const updateShopMutation = useMutation({
    mutationFn: updateShopRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ShopQueryKey.SHOPS] });
      resetShopForm();
    },
    onError: onMutateError,
  });

  const handleImagesChange = (urls: string[]) => {
    setShopValue('logo', urls[0] || '');
  };

  const onShopSubmit = (data: ShopFormData) => {
    if (editingShop) {
      updateShopMutation.mutate({ shopId: editingShop.uuid, data });
    } else {
      createShopMutation.mutate(data);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value === 'add-new') {
      setOpenAddressDialog(true);
      setShopValue('address_id', null);
    } else {
      setShopValue('address_id', value ? Number(value) : null);
    }
  };

  return (
    <>
      <Box>
        <Typography variant='h4' fontWeight='bold' mb={3}>
          {isEditing ? 'Cập nhật cửa hàng' : 'Thêm mới cửa hàng'}
        </Typography>
        <Box>
          <FormWrapper form={form} onSubmit={onShopSubmit}>
            <Stack gap={2} mt={2}>
              <Paper elevation={3} sx={{ borderRadius: '24px', p: 3, bgcolor: 'white' }}>
                <Typography variant='h6' fontWeight='bold' mb={2}>
                  Thông tin cơ bản
                </Typography>
                <Stack gap={3}>
                  <TextField
                    control={form.control}
                    name='name'
                    label='Tên cửa hàng'
                    placeholder='Enter shop name'
                    size='medium'
                    sx={{ borderRadius: '12px' }}
                  />
                  <TextAreaField
                    control={form.control}
                    name='description'
                    label='Mô tả'
                    placeholder='Enter shop description'
                    size='medium'
                    sx={{ borderRadius: '12px' }}
                  />
                  <Stack direction='column' gap={1}>
                    <SelectField
                      control={form.control}
                      name='address_id'
                      label='Address'
                      size='medium'
                      disabled={isUserLoading}
                      onChange={handleAddressChange}
                      sx={{ borderRadius: '12px' }}
                      focused
                    >
                      <option value=''>Chọn địa chỉ</option>
                      {currentUser?.addresses?.map((address) => (
                        <option key={address.id} value={address.id}>
                          {address.address}
                        </option>
                      ))}
                    </SelectField>
                    <Button
                      variant='outlined'
                      color='primary'
                      startIcon={<AddIcon />}
                      onClick={() => setOpenAddressDialog(true)}
                      sx={{ alignSelf: 'flex-start', borderRadius: '12px' }}
                    >
                      Thêm địa chỉ
                    </Button>
                  </Stack>
                  <SelectField
                    control={form.control}
                    name='is_active'
                    label='Trạng thái'
                    size='medium'
                    sx={{ borderRadius: '12px' }}
                    onChange={(e) => setShopValue('is_active', e.target.value === 'true')}
                  >
                    <option value='true'>Active</option>
                    <option value='false'>Inactive</option>
                  </SelectField>
                </Stack>
              </Paper>

              <Paper elevation={3} sx={{ borderRadius: '24px', p: 3, bgcolor: 'white' }}>
                <Typography variant='h6' fontWeight='bold' mb={2}>
                  Logo cửa hàng
                </Typography>
                <ImageUploader onImagesChange={handleImagesChange} />
              </Paper>
            </Stack>
          </FormWrapper>
        </Box>
        <Box sx={{ p: 3 }}>
          <Button
            type='submit'
            form='form-submit-wrapper'
            variant='contained'
            color='primary'
            sx={{ borderRadius: '12px', bgcolor: 'blue.600', '&:hover': { bgcolor: 'blue.700' } }}
          >
            {isEditing ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </Box>
      </Box>

      {/* Address Creation Dialog */}
      <AddressForm
        currentUser={currentUser}
        openAddressDialog={openAddressDialog}
        refetchUser={refetchUser}
        setShopValue={setShopValue}
        setOpenAddressDialog={setOpenAddressDialog}
      />
    </>
  );
}
