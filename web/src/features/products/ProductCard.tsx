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
  const [imageLoaded, setImageLoaded] = useState(false);

  const isOutOfStock = product.qty <= 0;
  const isLowStock = !isOutOfStock && product.qty <= 10;
  const saving = product.price - product.finalPrice;

  async function handleAdd() {
    setAdding(true);
    await onAdd(product.idProduct);
    setAdding(false);
  }

  return (
    <article
      className={`
        group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface
        transition-[transform,box-shadow,border-color] duration-250 ease-out-quint
        ${isOutOfStock ? '' : 'hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg dark:hover:border-brand-500/30'}
      `}
    >
      <div className="relative aspect-square overflow-hidden bg-sunken">
        {product.thumbnailUrl ? (
          <>
            {!imageLoaded && <div className="skeleton absolute inset-0" />}
            <img
              src={product.thumbnailUrl}
              alt={product.productName}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              className={`
                size-full object-cover transition-[opacity,transform] duration-500 ease-out-quint
                ${imageLoaded ? 'opacity-100' : 'opacity-0'}
                ${isOutOfStock ? 'grayscale' : 'group-hover:scale-[1.06]'}
              `}
            />
          </>
        ) : (
          <div className="grid size-full place-items-center text-ink-faint/30">
            <svg viewBox="0 0 24 24" className="size-10" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}

        {product.discountPercentage ? (
          <span className="absolute left-2.5 top-2.5 rounded-lg bg-critical px-2 py-1 text-[10px] font-bold leading-none tabular text-white shadow-sm">
            −{product.discountPercentage}%
          </span>
        ) : null}

        {isOutOfStock && (
          <div className="absolute inset-0 grid place-items-center bg-surface/70 backdrop-blur-[1px]">
            <span className="rounded-lg bg-surface px-2.5 py-1 text-2xs font-bold uppercase tracking-wide text-ink-soft shadow-sm">
              Stok habis
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-faint">
          {product.categoryName}
        </span>

        <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-ink transition-colors duration-150 group-hover:text-brand-600 dark:group-hover:text-brand-300">
          {product.productName}
        </h3>

        <div className="mt-auto pt-2.5">
          <div className="flex min-h-4 items-baseline gap-1.5">
            {saving > 0 && (
              <>
                <span className="text-2xs text-ink-faint line-through tabular">
                  {formatRupiah(product.price)}
                </span>
                <span className="text-2xs font-semibold text-critical tabular">
                  hemat {formatRupiah(saving)}
                </span>
              </>
            )}
          </div>

          <div className="mt-0.5 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-display text-base font-extrabold tracking-tight text-ink tabular">
                {formatRupiah(product.finalPrice)}
              </p>
              {isLowStock && (
                <p className="text-[10px] font-medium text-caution">Sisa {product.qty}</p>
              )}
            </div>

            <Button
              size="sm"
              onClick={handleAdd}
              loading={adding}
              disabled={isOutOfStock}
              aria-label={`Tambah ${product.productName} ke keranjang`}
            >
              Tambah
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
