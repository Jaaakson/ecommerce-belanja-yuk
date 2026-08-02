import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartApi } from '../../api/cart';
import { formatRupiah, toApiError } from '../../api/client';
import { lookupsApi } from '../../api/lookups';
import type { LookupItem } from '../../api/types';
import { AppHeader } from '../../components/AppHeader';
import { EmptyState } from '../../components/EmptyState';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { useCart } from '../../lib/cart';
import { useToast } from '../../lib/toast';
import { CartLine } from './CartLine';

export function CartPage() {
  const { summary, loading, refresh } = useCart();
  const { notify } = useToast();
  const navigate = useNavigate();

  const [payments, setPayments] = useState<LookupItem[]>([]);
  const [idPayment, setIdPayment] = useState('');
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void lookupsApi
      .payments()
      .then((result) => {
        if (!cancelled) setPayments(result);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  const items = summary?.items ?? [];
  const totalUnits = items.reduce((sum, item) => sum + item.qty, 0);
  const canCheckout = items.length > 0 && idPayment !== '' && !placing;

  async function handleCheckout() {
    setPlacing(true);
    try {
      const result = await cartApi.checkout(idPayment);
      await refresh();
      notify(`Pesanan dibuat — ${formatRupiah(result.finalPrice)} via ${result.paymentName}.`);
      navigate('/', { replace: true });
    } catch (error) {
      notify(toApiError(error).message, 'error');
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="min-h-screen bg-canvas">
      <AppHeader />

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-5">
        <nav className="mb-4 flex items-center gap-1.5 text-2xs font-medium text-ink-faint">
          <Link to="/" className="transition-colors duration-150 hover:text-brand-500">
            Beranda
          </Link>
          <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="m9 6 6 6-6 6" />
          </svg>
          <span className="text-ink-soft">Keranjang</span>
        </nav>

        <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr] lg:items-start">
          <section className="animate-rise rounded-2xl border border-line bg-surface p-5 shadow-sm">
            <div className="flex items-baseline justify-between gap-3">
              <h1 className="font-display text-xl font-extrabold tracking-tight text-ink">
                Keranjang
              </h1>
              {items.length > 0 && (
                <span className="text-2xs font-medium text-ink-faint tabular">
                  {items.length} produk · {totalUnits} barang
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-ink-soft">
              Atur kuantitas, cek diskon, lalu lanjutkan ke pembayaran.
            </p>

            <div className="mt-4 space-y-2.5">
              {loading && items.length === 0 ? (
                Array.from({ length: 3 }, (_, index) => (
                  <div key={index} className="flex gap-3 rounded-xl border border-line p-3">
                    <Skeleton className="size-18 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3.5 w-3/4" />
                      <Skeleton className="h-3 w-24" />
                      <div className="flex justify-between pt-1.5">
                        <Skeleton className="h-8 w-28 rounded-lg" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </div>
                  </div>
                ))
              ) : items.length === 0 ? (
                <EmptyState
                  icon="M5 6h16l-1.6 9H7.2L5 6ZM5 6l-.8-3H2M9 20.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm9 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                  title="Keranjang masih kosong"
                  description="Tambahkan barang dari beranda untuk mulai belanja."
                  action={
                    <Link to="/">
                      <Button variant="outline">Lihat produk</Button>
                    </Link>
                  }
                />
              ) : (
                items.map((item) => <CartLine key={item.idBuyerCart} item={item} />)
              )}
            </div>
          </section>

          <aside className="animate-rise rounded-2xl border border-line bg-surface p-5 shadow-sm lg:sticky lg:top-20">
            <h2 className="font-display text-lg font-extrabold tracking-tight text-ink">
              Ringkasan
            </h2>

            <dl className="mt-4 space-y-2.5 text-sm">
              <SummaryRow label="Subtotal" value={formatRupiah(summary?.subtotal ?? 0)} />

              {(summary?.totalDiscount ?? 0) > 0 && (
                <SummaryRow
                  label="Diskon"
                  value={`− ${formatRupiah(summary!.totalDiscount)}`}
                  tone="critical"
                />
              )}

              <SummaryRow
                label="Biaya Pengiriman"
                value={(summary?.shippingCost ?? 0) === 0 ? 'Gratis' : formatRupiah(summary!.shippingCost)}
                tone={(summary?.shippingCost ?? 0) === 0 ? 'positive' : undefined}
              />
            </dl>

            <div className="my-4 flex items-baseline justify-between border-t border-line pt-4">
              <span className="font-display font-extrabold text-ink">Total</span>
              <span className="font-display text-xl font-extrabold tracking-tight text-ink tabular">
                {formatRupiah(summary?.total ?? 0)}
              </span>
            </div>

            <fieldset className="space-y-2">
              <legend className="mb-2 text-2xs font-semibold uppercase tracking-wide text-ink-faint">
                Metode Pembayaran
              </legend>

              {payments.length === 0
                ? Array.from({ length: 2 }, (_, index) => (
                    <Skeleton key={index} className="h-11 rounded-xl" />
                  ))
                : payments.map((payment) => {
                    const selected = idPayment === payment.id;

                    return (
                      <label
                        key={payment.id}
                        className={`
                          flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-3 text-sm
                          transition-[background-color,border-color,color,box-shadow] duration-150 ease-out-quint
                          ${
                            selected
                              ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm dark:bg-brand-500/10 dark:text-brand-200'
                              : 'border-line text-ink-soft hover:border-brand-300 hover:bg-sunken'
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={payment.id}
                          checked={selected}
                          onChange={(event) => setIdPayment(event.target.value)}
                          className="peer sr-only"
                        />

                        <span
                          className={`grid size-4 place-items-center rounded-full border-2 transition-colors duration-150 ${
                            selected ? 'border-brand-500' : 'border-line-strong'
                          }`}
                        >
                          <span
                            className={`size-2 rounded-full bg-brand-500 transition-transform duration-150 ease-out-quint ${
                              selected ? 'scale-100' : 'scale-0'
                            }`}
                          />
                        </span>

                        <span className="font-medium">{payment.name}</span>
                      </label>
                    );
                  })}
            </fieldset>

            <Button
              onClick={handleCheckout}
              disabled={!canCheckout}
              loading={placing}
              size="lg"
              fullWidth
              className="mt-4"
            >
              Beli Barang
            </Button>

            {items.length > 0 && idPayment === '' && (
              <p className="mt-2.5 text-center text-2xs text-ink-faint">
                Pilih metode pembayaran untuk melanjutkan.
              </p>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'critical' | 'positive';
}) {
  const toneClass =
    tone === 'critical' ? 'text-critical' : tone === 'positive' ? 'text-positive' : 'text-ink';

  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-ink-soft">{label}</dt>
      <dd className={`font-semibold tabular ${toneClass}`}>{value}</dd>
    </div>
  );
}
