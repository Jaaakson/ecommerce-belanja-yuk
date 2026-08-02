import { useState } from 'react';
import { formatRupiah } from '../../api/client';
import type { CartItem } from '../../api/types';
import { useCart } from '../../lib/cart';

const MAX_QTY = 99;

export function CartLine({ item }: { item: CartItem }) {
  const { updateQty, remove } = useCart();
  const [busy, setBusy] = useState(false);

  const maxAllowed = Math.min(item.availableStock, MAX_QTY);

  async function changeQty(nextQty: number) {
    if (nextQty < 1 || nextQty > maxAllowed) return;

    setBusy(true);
    await updateQty(item.idBuyerCart, nextQty);
    setBusy(false);
  }

  async function handleRemove() {
    setBusy(true);
    await remove(item.idBuyerCart);
    setBusy(false);
  }

  return (
    <article
      className={`flex gap-3 rounded-xl border border-[var(--color-line)] p-3 transition-opacity ${busy ? 'opacity-60' : ''}`}
    >
      <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-[var(--color-canvas)]">
        {item.thumbnailUrl && (
          <img
            src={item.thumbnailUrl}
            alt={item.productName}
            loading="lazy"
            className="size-full object-cover"
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <h3 className="flex-1 text-sm font-semibold leading-snug text-[var(--color-ink)]">
            {item.productName}
          </h3>
          {item.discountPercentage ? (
            <span className="shrink-0 rounded bg-rose-500/10 px-1.5 py-0.5 text-[11px] font-bold text-rose-500">
              Diskon {item.discountPercentage}%
            </span>
          ) : null}
        </div>

        <div className="mt-1 flex flex-wrap items-baseline gap-x-2 text-sm">
          {item.discountPercentage ? (
            <span className="text-xs text-[var(--color-muted)] line-through">
              {formatRupiah(item.price)}
            </span>
          ) : null}
          <span className="font-semibold text-[var(--color-ink)]">
            {formatRupiah(item.finalPrice)}
          </span>
          {item.discountAmount > 0 && (
            <span className="text-xs text-rose-500">(- {formatRupiah(item.discountAmount)})</span>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            <QtyButton
              label="Kurangi jumlah"
              onClick={() => changeQty(item.qty - 1)}
              disabled={busy || item.qty <= 1}
            >
              −
            </QtyButton>

            <span
              className="min-w-9 text-center text-sm font-semibold text-[var(--color-ink)]"
              aria-live="polite"
            >
              {item.qty}
            </span>

            <QtyButton
              label="Tambah jumlah"
              onClick={() => changeQty(item.qty + 1)}
              disabled={busy || item.qty >= maxAllowed}
            >
              +
            </QtyButton>

            <button
              onClick={handleRemove}
              disabled={busy}
              aria-label={`Hapus ${item.productName}`}
              className="ml-1 grid size-7 place-items-center rounded-lg text-[var(--color-muted)] transition-colors hover:bg-rose-500/10 hover:text-rose-500 disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 7h16M9 7V5h6v2m-8 0 1 12h8l1-12" />
              </svg>
            </button>
          </div>

          <div className="text-right">
            <span className="block text-[11px] text-[var(--color-muted)]">Subtotal</span>
            <span className="font-display text-sm font-extrabold text-[var(--color-ink)]">
              {formatRupiah(item.subtotal)}
            </span>
          </div>
        </div>

        {item.qty >= maxAllowed && (
          <p className="mt-1.5 text-[11px] text-amber-600 dark:text-amber-400">
            {item.availableStock < MAX_QTY
              ? `Stok tersisa ${item.availableStock}.`
              : `Maksimal ${MAX_QTY} per barang.`}
          </p>
        )}
      </div>
    </article>
  );
}

function QtyButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid size-7 place-items-center rounded-lg border border-[var(--color-line)] text-sm font-bold text-[var(--color-ink)] transition-colors hover:border-brand-500 hover:text-brand-500 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}
