import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CartItem = {
  productId: string; // slug
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

type CartState = {
  items: Record<string, CartItem>;
  add: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: {},
      add: (item, qty = 1) => set(state => {
        const existing = state.items[item.productId];
        const nextQty = (existing?.quantity ?? 0) + qty;
        return {
          items: {
            ...state.items,
            [item.productId]: { ...item, quantity: nextQty }
          }
        };
      }),
      remove: (productId) => set(state => {
        const next = { ...state.items };
        delete next[productId];
        return { items: next };
      }),
      setQty: (productId, qty) => set(state => {
        if (qty <= 0) {
          const next = { ...state.items };
          delete next[productId];
          return { items: next };
        }
        const item = state.items[productId];
        if (!item) return state;
        return { items: { ...state.items, [productId]: { ...item, quantity: qty } } };
      }),
      clear: () => set({ items: {} }),
      totalItems: () => Object.values(get().items).reduce((sum, it) => sum + it.quantity, 0),
      totalPrice: () => Object.values(get().items).reduce((sum, it) => sum + it.quantity * it.price, 0)
    }),
    { name: 'drews3dprinting-cart' }
  )
);
