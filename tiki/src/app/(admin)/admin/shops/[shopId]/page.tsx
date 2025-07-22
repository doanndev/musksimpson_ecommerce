'use client';

import { useProductsQuery, useUpdateProductMutation } from '@/api/products/query';
import { useShopByIdQuery } from '@/api/shop/query';
import { CircularProgress, Dialog, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import CreateEditProductForm from './components/CreateEditProductForm';
import ProductList from './components/ProductList';
import ShopInfo from './components/ShopInfo';

export default function ShopDetailsPage() {
  const { shopId } = useParams();
  const queryClient = useQueryClient();
  const [tabValue, setTabValue] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const { data: shop, isLoading: shopLoading, error: shopError } = useShopByIdQuery(shopId as string);

  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useProductsQuery({ shop_id: shop?.uuid || '' });

  // const { data: ordersData, isLoading: ordersLoading, error: ordersError } = useQuery({
  //   queryKey: ['orders', shopId],
  //   queryFn: () => orderApi.getOrdersByShop(shopId as string, {}),
  // });

  const updateMutation = useUpdateProductMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', shopId] });
      setOpenForm(false);
    },
  });

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setOpenForm(true);
  };

  const handleSubmitProduct = (data: any) => {
    if (editingProduct) {
      updateMutation.mutate({ productId: editingProduct.uuid, data });
    }
  };

  // Mock categories (fetch from API in real app)
  const categories = [
    { value: 'category-uuid-1', label: 'Category 1' },
    { value: 'category-uuid-2', label: 'Category 2' },
  ];

  return (
    <div>
      {shopLoading ? (
        <Stack alignItems='center' mt={5}>
          <CircularProgress />
        </Stack>
      ) : shopError ? (
        <Typography color='error' align='center' mt={5}>
          Error loading shop: {(shopError as any).message}
        </Typography>
      ) : (
        <Stack gap={2}>
          <ShopInfo shop={shop} totalProducts={productsData?.items?.length || 0} totalOrders={0} />

          <Paper elevation={3} sx={{ borderRadius: '24px', p: 2, bgcolor: 'white', mb: 2 }}>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              variant='fullWidth'
              sx={{ bgcolor: 'white', borderRadius: '16px' }}
            >
              <Tab label='Products' sx={{ fontWeight: 'bold' }} />
              <Tab label='Orders' sx={{ fontWeight: 'bold' }} />
            </Tabs>
          </Paper>

          {tabValue === 0 && (
            <>
              {productsLoading ? (
                <Stack alignItems='center' mt={5}>
                  <CircularProgress />
                </Stack>
              ) : productsError ? (
                <Typography color='error' align='center' mt={5}>
                  Error loading products: {(productsError as any).message}
                </Typography>
              ) : (
                <ProductList shopId={shopId as string} onEdit={handleEditProduct} />
              )}
            </>
          )}

          {/* {tabValue === 1 && (
            <>
              {ordersLoading ? (
                <Stack alignItems="center" mt={5}>
                  <CircularProgress />
                </Stack>
              ) : ordersError ? (
                <Typography color="error" align="center" mt={5}>
                  Error loading orders: {(ordersError as any).message}
                </Typography>
              ) : (
                <OrderList orders={ordersData?.data?.items || []} />
              )}
            </>
          )} */}

          <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth='md' fullWidth>
            <CreateEditProductForm
              onSubmit={handleSubmitProduct}
              defaultValues={editingProduct}
              isEditing={!!editingProduct}
              categories={categories}
              shopId={shopId as string}
            />
          </Dialog>
        </Stack>
      )}
    </div>
  );
}
