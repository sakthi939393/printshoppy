import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  designId?: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    basePrice: number;
    images: Array<{ url: string; isPrimary: boolean }>;
  };
  variant?: { id: string; name: string; price: number };
  customization?: object;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  isOpen: boolean;
  fetchCart: () => Promise<void>;
  addItem: (data: {
    productId: string;
    variantId?: string;
    designId?: string;
    quantity: number;
    customization?: object;
  }) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => void;
  toggleCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      isOpen: false,

      fetchCart: async () => {
        try {
          const data = await api.getCart() as any;
          set({ items: data.items || [] });
        } catch {}
      },

      addItem: async (data) => {
        set({ isLoading: true });
        try {
          await api.addToCart(data);
          await get().fetchCart();
          set({ isLoading: false, isOpen: true });
          toast.success('Added to cart!');
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error.message || 'Failed to add to cart');
          throw error;
        }
      },

      updateItem: async (itemId, quantity) => {
        try {
          await api.updateCartItem(itemId, quantity);
          await get().fetchCart();
        } catch (error: any) {
          toast.error(error.message || 'Failed to update cart');
        }
      },

      removeItem: async (itemId) => {
        try {
          await api.removeFromCart(itemId);
          set(state => ({ items: state.items.filter(i => i.id !== itemId) }));
          toast.success('Item removed');
        } catch (error: any) {
          toast.error(error.message || 'Failed to remove item');
        }
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set(state => ({ isOpen: !state.isOpen })),

      getTotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.variant?.price ?? item.product.basePrice;
          return total + price * item.quantity;
        }, 0);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
