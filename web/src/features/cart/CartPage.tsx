import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartApi } from '../../api/cart';
import { formatRupiah, toApiError } from '../../api/client';
import { lookupsApi } from '../../api/lookups';
import type { LookupItem } from '../../api/types';
import { AppHeader } from '../../components/AppHeader';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/ui/Button';
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

  // The spec requires both conditions: at least one item and a chosen method.
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
    <div className="min-h-screen bg-[var(--color-canvas)]">
      <AppHeader />

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr] lg:items-start">
          <section className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
            <h1 className="font-display text-xl font-extrabold text-[var(--color-ink)]">
              Keranjang
            </h1>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Atur kuantitas, cek diskon, lalu lanjutkan ke pembayaran.
            </p>

            <div className="mt-4 space-y-3">
              {loading && items.length === 0 ? (
                Array.from({ length: 3 }, (_, index) => (
                  <div
                    key={index}
                    className="h-24 animate-pulse rounded-xl border border-[var(--color-line)]"
                  />
                ))
              ) : items.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[var(--color-line)] p-10 text-center">
                  <Logo withWordmark={false} />
                  <p className="mt-3 font-semibold text-[var(--color-ink)]">Keranjang kosong.</p>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">
                    Tambahkan barang dari beranda untuk mulai belanja.
                  </p>
                  <Link to="/" className="mt-4 inline-block">
                    <Button variant="outline">Lihat produk</Button>
                  </Link>
                </div>
              ) : (
                items.map((item) => <CartLine key={item.idBuyerCart} item={item} />)
              )}
            </div>
          </section>

          <aside className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 lg:sticky lg:top-20">
            <h2 className="font-display text-lg font-extrabold text-[var(--color-ink)]">
              Ringkasan
            </h2>

            <dl className="mt-4 space-y-2.5 text-sm">
              <SummaryRow label="Subtotal" value={formatRupiah(summary?.subtotal ?? 0)} />
              <SummaryRow
                label="Diskon"
                value={`- ${formatRupiah(summary?.totalDiscount ?? 0)}`}
                tone="discount"
              />
              <SummaryRow
                label="Biaya Pengiriman"
                value={
                  (summary?.shippingCost ?? 0) === 0
                    ? 'Gratis'
                    : formatRupiah(summary!.shippingCost)
                }
              />
              <SummaryRow
                label="Metode Pembayaran"
                value={payments.find((p) => p.id === idPayment)?.name ?? 'Belum dipilih'}
              />
            </dl>

            <div className="my-4 border-t border-[var(--color-line)] pt-4">
              <div className="flex items-baseline justify-between">
                <span className="font-display font-extrabold text-[var(--color-ink)]">Total</span>
                <span className="font-display text-xl font-extrabold text-[var(--color-ink)]">
                  {formatRupiah(summary?.total ?? 0)}
                </span>
              </div>
            </div>

            <fieldset className="space-y-2">
              <legend className="sr-only">Metode pembayaran</legend>
              {payments.map((payment) => (
                <label
                  key={payment.id}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm transition-colors ${
                    idPayment === payment.id
                      ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-100'
                      : 'border-[var(--color-line)] text-[var(--color-muted)] hover:border-brand-500/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={payment.id}
                    checked={idPayment === payment.id}
                    onChange={(e) => setIdPayment(e.target.value)}
                    className="size-4 accent-brand-500"
                  />
                  <span className="font-medium">{payment.name}</span>
                </label>
              ))}
            </fieldset>

            <Button
              onClick={handleCheckout}
              disabled={!canCheckout}
              loading={placing}
              className="mt-4 w-full"
            >
              Beli Barang
            </Button>

            {items.length > 0 && idPayment === '' && (
              <p className="mt-2 text-center text-xs text-[var(--color-muted)]">
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
  tone?: 'discount';
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-[var(--color-muted)]">{label}</dt>
      <dd
        className={`font-semibold ${tone === 'discount' ? 'text-rose-500' : 'text-[var(--color-ink)]'}`}
      >
        {value}
      </dd>
    </div>
  );
}
