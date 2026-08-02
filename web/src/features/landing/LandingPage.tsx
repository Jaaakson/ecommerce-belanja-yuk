import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatRupiah } from '../../api/client';
import { productsApi } from '../../api/products';
import type { ProductListItem } from '../../api/types';
import { Logo } from '../../components/Logo';
import { ThemeToggle } from '../../components/ThemeToggle';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';

const benefits = [
  {
    title: 'Harga jujur',
    body: 'Diskon dihitung di server dan ditampilkan apa adanya — tidak ada harga coret yang mengada-ada.',
    icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  },
  {
    title: 'Gratis ongkir',
    body: 'Semua pesanan dikirim tanpa biaya tambahan, berapa pun jumlah barangnya.',
    icon: 'M5 18H3V6h11v12H9m10 0h2v-5l-3-4h-4v9h1M7.5 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
  },
  {
    title: 'Bayar fleksibel',
    body: 'Transfer bank atau bayar di tempat. Pilih yang paling nyaman saat checkout.',
    icon: 'M2 7h20v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Zm0 0 3-4h14l3 4M7 15h4',
  },
];

export function LandingPage() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    // The catalogue endpoint is public, so the preview shows real inventory
    // rather than placeholder cards.
    void productsApi
      .list({ pageSize: 4 })
      .then((result) => {
        if (!cancelled) setProducts(result.items);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-40 border-b border-transparent bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center px-4">
          <Logo />

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost">Masuk</Button>
            </Link>
            <Link to="/register">
              <Button>Daftar</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4">
        <section className="relative overflow-hidden py-16 text-center sm:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 -z-10 size-[34rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-brand-500/10 blur-3xl dark:bg-brand-500/15"
          />

          <span className="animate-rise inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-2xs font-semibold text-ink-soft shadow-xs">
            <span className="size-1.5 rounded-full bg-positive" />
            Promo awal bulan sedang berjalan
          </span>

          <h1
            className="animate-rise mx-auto mt-6 max-w-2xl font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl"
            style={{ animationDelay: '60ms' }}
          >
            Belanja jadi mudah,
            <br />
            <span className="text-brand-500">cepat, dan hemat.</span>
          </h1>

          <p
            className="animate-rise mx-auto mt-5 max-w-lg text-base leading-relaxed text-ink-soft"
            style={{ animationDelay: '120ms' }}
          >
            Ribuan produk pilihan dengan harga terbaik, gratis ongkir, dan pengiriman yang bisa
            diandalkan. Buat akun dalam satu menit.
          </p>

          <div
            className="animate-rise mt-8 flex flex-wrap justify-center gap-3"
            style={{ animationDelay: '180ms' }}
          >
            <Link to="/register">
              <Button size="lg">Mulai belanja</Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Sudah punya akun
              </Button>
            </Link>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          {benefits.map((benefit) => (
            <article
              key={benefit.title}
              className="rounded-2xl border border-line bg-surface p-5 transition-[border-color,box-shadow,transform] duration-250 ease-out-quint hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md dark:hover:border-brand-500/30"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/12 dark:text-brand-300">
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={benefit.icon} />
                </svg>
              </span>

              <h2 className="mt-4 font-display text-base font-bold text-ink">{benefit.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{benefit.body}</p>
            </article>
          ))}
        </section>

        <section className="py-16">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 className="font-display text-xl font-extrabold tracking-tight text-ink">
              Lagi banyak dicari
            </h2>
            <Link
              to="/register"
              className="text-2xs font-semibold text-brand-500 underline-offset-4 transition-colors duration-150 hover:text-brand-600 hover:underline"
            >
              Lihat semua
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {loading
              ? Array.from({ length: 4 }, (_, index) => (
                  <Skeleton key={index} className="aspect-[3/4] rounded-2xl" />
                ))
              : products.map((product) => (
                  <Link
                    key={product.idProduct}
                    to="/register"
                    className="group overflow-hidden rounded-2xl border border-line bg-surface transition-[transform,box-shadow,border-color] duration-250 ease-out-quint hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg dark:hover:border-brand-500/30"
                  >
                    <div className="aspect-square overflow-hidden bg-sunken">
                      {product.thumbnailUrl && (
                        <img
                          src={product.thumbnailUrl}
                          alt={product.productName}
                          loading="lazy"
                          className="size-full object-cover transition-transform duration-500 ease-out-quint group-hover:scale-[1.06]"
                        />
                      )}
                    </div>

                    <div className="p-3">
                      <h3 className="line-clamp-1 text-sm font-semibold text-ink">
                        {product.productName}
                      </h3>
                      <p className="mt-1 font-display text-sm font-extrabold text-ink tabular">
                        {formatRupiah(product.finalPrice)}
                      </p>
                    </div>
                  </Link>
                ))}
          </div>
        </section>

        <section className="mb-16 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 px-6 py-12 text-center shadow-md">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Siap mulai belanja?
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-white/75">
            Buat akun gratis dan nikmati gratis ongkir untuk semua pesanan.
          </p>

          <Link to="/register" className="mt-6 inline-block">
            <Button
              size="lg"
              className="!bg-white !text-brand-600 !shadow-none hover:!bg-brand-50"
            >
              Daftar sekarang
            </Button>
          </Link>
        </section>
      </main>

      <footer className="border-t border-line py-6 text-center text-2xs text-ink-faint">
        © {new Date().getFullYear()} BelanjaYuk
      </footer>
    </div>
  );
}
