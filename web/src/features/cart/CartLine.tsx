import { useState } from 'react';
import { formatRupiah } from '../../api/client';
import type { CartItem } from '../../api/types';
import { useCart } from '../../lib/cart';

const MAX_QTY = 99;

export function CartLine({ item }: { item: CartItem }) {
  const { updateQty, remove } = useCart();
  const [busy, setBusy] = useState(false);
  const [removing, setRemoving] = useState(false);

  const maxAllowed = Math.min(item.availableStock, MAX_QTY);
  const atStockLimit = item.qty >= item.availableStock && item.availableStock < MAX_QTY;

  async function changeQty(nextQty: number) {
    if (nextQty < 1 || nextQty > maxAllowed || busy) return;

    setBusy(true);
    await updateQty(item.idBuyerCart, nextQty);
    setBusy(false);
  }

  async function handleRemove() {
    // Play the exit before the request so the row does not sit there looking
    // unresponsive while the server catches up.
    setRemoving(true);
    await new Promise((resolve) => setTimeout(resolve, 160));
    await remove(item.idBuyerCart);
  }

  return (
    <article
      className={`
        group relative flex gap-3 rounded-xl border border-line bg-surface p-3
        transition-[opacity,transform,border-color,box-shadow] duration-200 ease-out-quint
        hover:border-line-strong hover:shadow-sm
        ${removing ? 'scale-[0.97] opacity-0' : 'opacity-100'}
        ${busy ? 'pointer-events-none' : ''}
      `}
    >
      <div className="size-18 shrink-0 overflow-hidden rounded-lg bg-sunken">
        {item.thumbnailUrl && (
          <img
            src={item.thumbnailUrl}
            alt={item.productName}
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 ease-out-quint group-hover:scale-105"
          />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start gap-2">
          <h3 className="line-clamp-2 flex-1 text-sm font-semibold leading-snug text-ink">
            {item.productName}
          </h3>

          <button
            onClick={handleRemove}
            disabled={busy}
            aria-label={`Hapus ${item.productName} dari keranjang`}
            className="grid size-7 shrink-0 place-items-center rounded-lg text-ink-faint opacity-0 transition-[opacity,background-color,color] duration-150 hover:bg-critical/10 hover:text-critical focus-visible:opacity-100 group-hover:opacity-100 disabled:opacity-40"
          >
            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 7h16M9 7V5h6v2m-8 0 1 12h8l1-12" />
            </svg>
          </button>
        </div>

        <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-sm font-semibold text-ink tabular">
            {formatRupiah(item.finalPrice)}
          </span>

          {item.discountPercentage ? (
            <>
              <span className="text-2xs text-ink-faint line-through tabular">
                {formatRupiah(item.price)}
              </span>
              <span className="rounded bg-critical/10 px-1.5 py-0.5 text-[10px] font-bold leading-none text-critical tabular">
                −{item.discountPercentage}%
              </span>
            </>
          ) : null}
        </div>

        <div className="mt-2.5 flex items-end justify-between gap-3">
          <div className="inline-flex items-center rounded-lg border border-line bg-surface p-0.5">
            <QtyButton
              label="Kurangi jumlah"
              onClick={() => changeQty(item.qty - 1)}
              disabled={busy || item.qty <= 1}
            >
              <path d="M5 12h14" />
            </QtyButton>

            <span
              aria-live="polite"
              className="min-w-8 text-center text-sm font-bold text-ink tabular"
            >
              {item.qty}
            </span>

            <QtyButton
              label="Tambah jumlah"
              onClick={() => changeQty(item.qty + 1)}
              disabled={busy || item.qty >= maxAllowed}
            >
              <path d="M12 5v14M5 12h14" />
            </QtyButton>
          </div>

          <div className="text-right">
            <span className="block text-[10px] font-medium uppercase tracking-wider text-ink-faint">
              Subtotal
            </span>
            <span className="font-display text-sm font-extrabold text-ink tabular">
              {formatRupiah(item.subtotal)}
            </span>
          </div>
        </div>

        {atStockLimit && (
          <p className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium text-caution">
            <svg viewBox="0 0 24 24" className="size-3" fill="currentColor">
              <path d="M12 2 1 21h22ZM11 10h2v5h-2Zm0 7h2v2h-2Z" />
            </svg>
            Stok tersisa {item.availableStock}
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
      className="grid size-7 place-items-center rounded-md text-ink-soft transition-[background-color,color,transform] duration-150 ease-out-quint hover:bg-brand-50 hover:text-brand-600 active:scale-90 disabled:cursor-not-allowed disabled:text-ink-faint/40 disabled:hover:bg-transparent dark:hover:bg-brand-500/10 dark:hover:text-brand-200"
    >
      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        {children}
      </svg>
    </button>
  );
}
