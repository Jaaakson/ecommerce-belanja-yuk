import { api, unwrap } from './client';
import type { CartSummary, CheckoutResponse } from './types';

export const cartApi = {
  get: () => unwrap<CartSummary>(api.get('/cart')),
  add: (idProduct: string, qty: number) =>
    unwrap<CartSummary>(api.post('/cart/items', { idProduct, qty })),
  updateQty: (idBuyerCart: string, qty: number) =>
    unwrap<CartSummary>(api.patch(`/cart/items/${idBuyerCart}`, { qty })),
  remove: (idBuyerCart: string) => unwrap<CartSummary>(api.delete(`/cart/items/${idBuyerCart}`)),
  checkout: (idPayment: string) =>
    unwrap<CheckoutResponse>(api.post('/checkout', { idPayment })),
};
