import { createContext, useContext } from 'react';
import type { CartSummary } from '../api/types';

export interface CartState {
  summary: CartSummary | null;
  itemCount: number;
  loading: boolean;
  refresh: () => Promise<void>;
  add: (idProduct: string, qty?: number) => Promise<void>;
  updateQty: (idBuyerCart: string, qty: number) => Promise<void>;
  remove: (idBuyerCart: string) => Promise<void>;
  clear: () => void;
}

export const CartContext = createContext<CartState | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
