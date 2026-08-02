import { useState } from 'react';
import { formatRupiah } from '../../api/client';
import type { ProductListItem } from '../../api/types';
import { Button } from '../../components/ui/Button';

export function ProductCard({
  product,
  onAdd,
}: {
  product: ProductListItem;
  onAdd: (idProduct: string) => Promise<void>;
}) {
  const [adding, setAdding] = useState(false);
  const isOutOfStock = product.qty <= 0;

  async function handleAdd() {
    setAdding(true);
    await onAdd(product.idProduct);
    setAdding(false);
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] transition-all hover:-translate-y-0.5 hover:border-brand-500/40 hover:shadow-lg hover:shadow-brand-500/5">
      <div className="relative aspect-square overflow-hidden bg-[var(--color-canvas)]">
        {product.thumbnailUrl ? (
          <img
            src={product.thumbnailUrl}
            alt={product.productName}
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="grid size-full place-items-center text-[var(--color-muted)]/40">
            <svg viewBox="0 0 24 24" className="size-10" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}

        {product.discountPercentage ? (
          <span className="absolute left-2 top-2 rounded-lg bg-rose-500 px-2 py-0.5 text-[11px] font-bold text-white">
            {product.discountPercentage}%
          </span>
        ) : null}

        {isOutOfStock && (
          <div className="absolute inset-0 grid place-items-center bg-[var(--color-surface)]/80 backdrop-blur-[2px]">
            <span className="text-xs font-bold uppercase tracking-wide text-[var(--color-muted)]">
              Stok habis
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-muted)]">
          {product.categoryName}
        </span>

        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-[var(--color-ink)]">
          {product.productName}
        </h3>

        <div className="mt-auto pt-2">
          {product.discountPercentage ? (
            <span className="block text-xs text-[var(--color-muted)] line-through">
              {formatRupiah(product.price)}
            </span>
          ) : null}

          <div className="flex items-end justify-between gap-2">
            <span className="font-display text-base font-extrabold text-[var(--color-ink)]">
              {formatRupiah(product.finalPrice)}
            </span>

            <Button
              onClick={handleAdd}
              loading={adding}
              disabled={isOutOfStock}
              className="!px-3 !py-1.5 text-xs"
            >
              Tambah
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
