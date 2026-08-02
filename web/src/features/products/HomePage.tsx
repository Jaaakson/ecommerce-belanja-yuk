import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toApiError } from '../../api/client';
import { lookupsApi } from '../../api/lookups';
import { productsApi } from '../../api/products';
import type { LookupItem, ProductListItem } from '../../api/types';
import { AppHeader } from '../../components/AppHeader';
import { BackToTop } from '../../components/BackToTop';
import { EmptyState } from '../../components/EmptyState';
import { Button } from '../../components/ui/Button';
import { ProductCardSkeleton } from '../../components/ui/Skeleton';
import { useAuth } from '../../lib/auth';
import { useCart } from '../../lib/cart';
import { useToast } from '../../lib/toast';
import { ProductCard } from './ProductCard';

const ALL_CATEGORIES = 'all';
const PAGE_SIZE = 24;

export function HomePage() {
  const { user } = useAuth();
  const { add, itemCount } = useCart();
  const { notify } = useToast();

  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [categories, setCategories] = useState<LookupItem[]>([]);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(
    async (keyword: string, idCategory: string) => {
      setLoading(true);
      try {
        const result = await productsApi.list({
          search: keyword.trim() || undefined,
          idCategory: idCategory === ALL_CATEGORIES ? undefined : idCategory,
          pageSize: PAGE_SIZE,
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
          productsApi.list({ pageSize: PAGE_SIZE }),
          lookupsApi.categories(),
        ]);

        if (cancelled) return;
        setProducts(productPage.items);
        setCategories(categoryList);
      } catch {
        // The empty state below already covers a failed first load.
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

  function resetFilters() {
    setSearch('');
    setActiveCategory(ALL_CATEGORIES);
    void loadProducts('', ALL_CATEGORIES);
  }

  const firstName = user?.fullName.split(' ')[0] ?? '';
  const isFiltered = search !== '' || activeCategory !== ALL_CATEGORIES;

  return (
    <div className="min-h-screen bg-canvas">
      <AppHeader onSearch={handleSearch} />

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-5">
        <section className="animate-rise grid gap-4 lg:grid-cols-[1.55fr_1fr]">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 p-6 shadow-md">
            <div aria-hidden className="absolute -right-10 -top-14 size-44 rounded-full bg-white/10" />
            <div aria-hidden className="absolute -bottom-16 right-16 size-32 rounded-full bg-white/5" />

            <span className="relative inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
              <span className="size-1.5 animate-pulse rounded-full bg-white" />
              Promo awal bulan
            </span>

            <h1 className="relative mt-3.5 max-w-md font-display text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl">
              Belanja jadi mudah, cepat, dan hemat
            </h1>
            <p className="relative mt-1.5 max-w-sm text-sm text-white/75">
              Pilihan produk favorit dengan harga terbaik, dikirim hari ini juga.
            </p>
          </div>

          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-line bg-surface p-6 shadow-sm">
            <div>
              <p className="text-2xs font-semibold uppercase tracking-wider text-ink-faint">
                Halo,
              </p>
              <p className="mt-0.5 truncate font-display text-lg font-extrabold tracking-tight text-ink">
                {firstName}
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                {itemCount > 0
                  ? `${itemCount} barang menunggu di keranjang.`
                  : 'Keranjang masih kosong. Yuk mulai belanja.'}
              </p>
            </div>

            <Link to="/cart" className="block">
              <Button variant={itemCount > 0 ? 'primary' : 'outline'} fullWidth>
                Lihat Keranjang
              </Button>
            </Link>
          </div>
        </section>

        <section className="mt-5">
          {/* Horizontal scroll on small screens keeps chips on one line instead
              of wrapping into a block that pushes the grid down. */}
          <div className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max gap-2">
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
        </section>

        <section className="mt-5">
          <div className="mb-3.5 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-lg font-extrabold tracking-tight text-ink">
              {search ? `Hasil untuk "${search}"` : 'Barang Rekomendasi'}
            </h2>

            {!loading && products.length > 0 && (
              <span className="text-2xs font-medium text-ink-faint tabular">
                {products.length} produk
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {Array.from({ length: 10 }, (_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.5-4.5"
              title="Belum ada produk yang cocok"
              description="Coba kata kunci lain, atau lihat semua produk yang tersedia."
              action={
                isFiltered && (
                  <Button variant="outline" onClick={resetFilters}>
                    Tampilkan semua produk
                  </Button>
                )
              }
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {products.map((product, index) => (
                <div
                  key={product.idProduct}
                  className="animate-rise"
                  // A short stagger makes the grid resolve as a wave rather
                  // than a single block appearing at once.
                  style={{ animationDelay: `${Math.min(index, 9) * 35}ms` }}
                >
                  <ProductCard product={product} onAdd={add} />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-line py-6 text-center text-2xs text-ink-faint">
        © {new Date().getFullYear()} BelanjaYuk
      </footer>

      <BackToTop />
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
      className={`
        shrink-0 rounded-full border px-4 py-2 text-xs font-semibold
        transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out-quint
        active:scale-95
        ${
          active
            ? 'border-brand-500 bg-brand-500 text-white shadow-brand'
            : 'border-line bg-surface text-ink-soft hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/10 dark:hover:text-brand-200'
        }
      `}
    >
      {label}
    </button>
  );
}
