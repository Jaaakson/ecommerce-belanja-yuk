import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { cartApi } from '../api/cart';
import { toApiError } from '../api/client';
import type { CartSummary } from '../api/types';
import { CartContext } from '../lib/cart';
import { useAuth } from '../lib/auth';
import { useToast } from '../lib/toast';

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { notify } = useToast();

  const [summary, setSummary] = useState<CartSummary | null>(null);
  const [loading, setLoading] = useState(false);
  
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setSummary(await cartApi.get());
    } catch (error) {
      notify(toApiError(error).message, 'error');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  // Load the cart when a session exists. Clearing on logout is handled by
  // `clear()` at the call site, so this effect only ever fetches.
  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;

    void (async () => {
      try {
        const result = await cartApi.get();
        if (!cancelled) setSummary(result);
      } catch {
        // A failed initial load leaves the cart empty; mutations will retry.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  // Every mutation returns the recalculated summary, so the client never
  // recomputes totals or issues a follow-up fetch.
  const runMutation = useCallback(
    async (operation: () => Promise<CartSummary>, successMessage?: string) => {
      try {
        setSummary(await operation());
        if (successMessage) notify(successMessage);
      } catch (error) {
        notify(toApiError(error).message, 'error');
      }
    },
    [notify],
  );

  const add = useCallback(
    (idProduct: string, qty = 1) =>
      runMutation(() => cartApi.add(idProduct, qty), 'Barang ditambahkan ke keranjang.'),
    [runMutation],
  );

  const updateQty = useCallback(
    (idBuyerCart: string, qty: number) => runMutation(() => cartApi.updateQty(idBuyerCart, qty)),
    [runMutation],
  );

  const remove = useCallback(
    (idBuyerCart: string) =>
      runMutation(() => cartApi.remove(idBuyerCart), 'Barang dihapus dari keranjang.'),
    [runMutation],
  );

  return (
    <CartContext.Provider
      value={{
        summary,
        itemCount: summary?.items.length ?? 0,
        loading,
        refresh,
        add,
        updateQty,
        remove,
        clear: () => setSummary(null),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
