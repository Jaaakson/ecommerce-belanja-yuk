import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ApiRequestError } from '../../api/client';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
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
  const [showPassword, setShowPassword] = useState(false);
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

      // Field-level messages attach to the input; anything else surfaces as a toast.
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
      title="Hai, selamat datang kembali 👋"
      subtitle="Masuk pakai email atau no. HP yang terdaftar."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          name="identifier"
          label="Email / No. HP"
          placeholder="contoh@mail.com / 0812xxxx"
          hint="Format email valid atau nomor HP Indonesia"
          value={identifier}
          error={errors.identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          autoComplete="username"
        />

        <div className="relative">
          <Input
            name="password"
            label="Kata Sandi"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            error={errors.password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="pr-11"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
            className="absolute right-3 top-8 text-[var(--color-muted)] transition-colors hover:text-brand-500"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
              {showPassword && <path d="m3 3 18 18" strokeLinecap="round" />}
            </svg>
          </button>
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-muted)]">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="size-4 rounded border-[var(--color-line)] accent-brand-500"
          />
          Ingat saya
        </label>

        <Button type="submit" loading={submitting} className="w-full">
          Masuk
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
        Belum punya akun?{' '}
        <Link to="/register" className="font-semibold text-brand-500 hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </AuthLayout>
  );
}
