import type { ProductResponse } from '@/api/products/type';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ProductCheckout extends ProductResponse {
  cartId?: number;
  quantity: number;
}

interface CheckoutState {
  selectedProducts: { items: ProductCheckout[]; total_amount: number; type: 'cart' | 'direct' };
  setCheckoutData: (products: { items: ProductCheckout[]; total_amount: number; type: 'cart' | 'direct' }) => void;
  clearCheckoutData: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      selectedProducts: { items: [], total_amount: 0, type: 'cart' },
      setCheckoutData: (products) => set({ selectedProducts: products }),
      clearCheckoutData: () => set({ selectedProducts: { items: [], total_amount: 0, type: 'cart' } }),
    }),
    {
      name: 'checkout-storage',
      partialize: (state) => ({ selectedProducts: state.selectedProducts }),
    }
  )
);
