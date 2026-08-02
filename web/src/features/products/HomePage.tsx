import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toApiError } from '../../api/client';
import { lookupsApi } from '../../api/lookups';
import { productsApi } from '../../api/products';
import type { LookupItem, ProductListItem } from '../../api/types';
import { AppHeader } from '../../components/AppHeader';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../lib/auth';
import { useCart } from '../../lib/cart';
import { useToast } from '../../lib/toast';
import { ProductCard } from './ProductCard';

const ALL_CATEGORIES = 'all';

export function HomePage() {
  const { user } = useAuth();
  const { add } = useCart();
  const { notify } = useToast();

  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [categories, setCategories] = useState<LookupItem[]>([]);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const initials = user?.fullName
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const loadProducts = useCallback(
    async (keyword: string, idCategory: string) => {
      setLoading(true);
      try {
        const result = await productsApi.list({
          search: keyword.trim() || undefined,
          idCategory: idCategory === ALL_CATEGORIES ? undefined : idCategory,
          pageSize: 24,
        });
        setProducts(result.items);
      } catch (error) {
        notify(toApiError(error).message, 'error');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    [notify],
  );

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const [productPage, categoryList] = await Promise.all([
          productsApi.list({ pageSize: 24 }),
          lookupsApi.categories(),
        ]);

        if (cancelled) return;
        setProducts(productPage.items);
        setCategories(categoryList);
      } catch {
        // The empty state below covers a failed first load.
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleCategoryChange(idCategory: string) {
    setActiveCategory(idCategory);
    void loadProducts(search, idCategory);
  }

  function handleSearch(keyword: string) {
    setSearch(keyword);
    void loadProducts(keyword, activeCategory);
  }

  return (
    <div className="min-h-screen bg-[var(--color-canvas)]">
      <AppHeader onSearch={handleSearch} />

      <main className="mx-auto max-w-6xl px-4 py-6">
        <section className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-700 dark:bg-brand-500/15 dark:text-brand-100">
              ⚡ Promo awal bulan
            </span>

            <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-[var(--color-ink)]">
              Belanja jadi mudah, cepat, dan hemat
            </h1>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Nikmati pengiriman cepat dan banyak pilihan produk favorit.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <CategoryChip
                label="Semua"
                active={activeCategory === ALL_CATEGORIES}
                onClick={() => handleCategoryChange(ALL_CATEGORIES)}
              />
              {categories.map((category) => (
                <CategoryChip
                  key={category.id}
                  label={category.name}
                  active={activeCategory === category.id}
                  onClick={() => handleCategoryChange(category.id)}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-100 font-display text-sm font-extrabold text-brand-700">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[var(--color-ink)]">
                Halo, {user?.fullName.split(' ')[0]} 👋
              </p>
              <p className="text-xs text-[var(--color-muted)]">Siap belanja hari ini?</p>
            </div>
            <Link to="/cart">
              <Button className="!px-3 !py-1.5 text-xs">Keranjang</Button>
            </Link>
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-3 flex items-baseline gap-2">
            <h2 className="font-display text-lg font-extrabold text-[var(--color-ink)]">
              {search ? `Hasil untuk "${search}"` : 'Barang Rekomendasi'}
            </h2>
            {!loading && (
              <span className="text-xs text-[var(--color-muted)]">{products.length} produk</span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {Array.from({ length: 10 }, (_, index) => (
                <div
                  key={index}
                  className="h-64 animate-pulse rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)]"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--color-line)] p-12 text-center">
              <p className="font-semibold text-[var(--color-ink)]">Belum ada produk yang cocok</p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Coba kata kunci lain atau pilih kategori berbeda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {products.map((product) => (
                <ProductCard key={product.idProduct} product={product} onAdd={add} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-[var(--color-line)] py-6 text-center text-xs text-[var(--color-muted)]">
        © {new Date().getFullYear()} BelanjaYuk
      </footer>
    </div>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? 'border-brand-500 bg-brand-500 text-white'
          : 'border-[var(--color-line)] text-[var(--color-muted)] hover:border-brand-500 hover:text-brand-500'
      }`}
    >
      {label}
    </button>
  );
}
