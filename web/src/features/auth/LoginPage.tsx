import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { ApiRequestError } from '../../api/client';
import { Button } from '../../components/ui/Button';
import { Input, PasswordInput } from '../../components/ui/Input';
import { useAuth } from '../../lib/auth';
import { useToast } from '../../lib/toast';
import { AuthLayout } from './AuthLayout';

export function LoginPage() {
  const { login } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = (location.state as { from?: Location } | null)?.from?.pathname ?? '/';

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (!identifier.trim()) nextErrors.identifier = 'Email atau nomor HP wajib diisi.';
    if (!password) nextErrors.password = 'Kata sandi wajib diisi.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await login(identifier.trim(), password, remember);
      notify('Login berhasil.');
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const apiError = error as ApiRequestError;

      if (apiError.fieldErrors) {
        setErrors(
          Object.fromEntries(
            Object.entries(apiError.fieldErrors).map(([key, messages]) => [
              key.charAt(0).toLowerCase() + key.slice(1),
              messages[0],
            ]),
          ),
        );
      } else {
        notify(apiError.message, 'error');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Selamat datang kembali"
      subtitle="Masuk pakai email atau nomor HP yang terdaftar."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          name="identifier"
          label="Email atau No. HP"
          placeholder="contoh@mail.com"
          value={identifier}
          error={errors.identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          autoComplete="username"
          leading={
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" strokeLinecap="round" />
            </svg>
          }
        />

        <PasswordInput
          name="password"
          label="Kata Sandi"
          placeholder="Masukkan kata sandi"
          value={password}
          error={errors.password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          leading={
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="4" y="10" width="16" height="11" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" strokeLinecap="round" />
            </svg>
          }
        />

        <label className="group flex w-fit cursor-pointer select-none items-center gap-2.5 text-sm text-ink-soft transition-colors duration-150 hover:text-ink">
          <span className="relative grid size-4.5 place-items-center">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="peer size-4.5 cursor-pointer appearance-none rounded-md border border-line-strong bg-surface transition-[background-color,border-color] duration-150 checked:border-brand-500 checked:bg-brand-500 focus-visible:ring-4 focus-visible:ring-brand-500/15 group-hover:border-brand-400"
            />
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="pointer-events-none absolute size-3 scale-50 text-white opacity-0 transition-[opacity,transform] duration-150 ease-out-quint peer-checked:scale-100 peer-checked:opacity-100"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          Ingat saya selama 30 hari
        </label>

        <Button type="submit" size="lg" loading={submitting} fullWidth>
          Masuk
        </Button>
      </form>

      <div className="mt-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-2xs font-medium uppercase tracking-wide text-ink-faint">atau</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Belum punya akun?{' '}
        <Link
          to="/register"
          className="font-semibold text-brand-500 underline-offset-4 transition-colors duration-150 hover:text-brand-600 hover:underline"
        >
          Daftar sekarang
        </Link>
      </p>
    </AuthLayout>
  );
}
