import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { lookupsApi } from '../../api/lookups';
import type { ApiRequestError } from '../../api/client';
import type { LookupItem } from '../../api/types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useAuth } from '../../lib/auth';
import { useToast } from '../../lib/toast';
import { AuthLayout } from './AuthLayout';

const emptyForm = {
  fullName: '',
  userName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  dateOfBirth: '',
  idGender: '',
  provinsi: '',
  kotaKabupaten: '',
  kecamatan: '',
  kodePos: '',
  homeAddressDesc: '',
};

export function RegisterPage() {
  const { register } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [genders, setGenders] = useState<LookupItem[]>([]);
  const [showAddress, setShowAddress] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    lookupsApi
      .genders()
      .then(setGenders)
      .catch(() => notify('Gagal memuat pilihan jenis kelamin.', 'error'));
  }, [notify]);

  const update = (field: keyof typeof emptyForm) => (value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!agreed) {
      notify('Setujui Syarat & Kebijakan Privasi terlebih dahulu.', 'error');
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      await register({
        fullName: form.fullName.trim(),
        userName: form.userName.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth).toISOString() : null,
        idGender: form.idGender,
        primaryAddress: showAddress
          ? {
              provinsi: form.provinsi.trim(),
              kotaKabupaten: form.kotaKabupaten.trim(),
              kecamatan: form.kecamatan.trim(),
              kodePos: form.kodePos.trim(),
              homeAddressDesc: form.homeAddressDesc.trim(),
            }
          : null,
      });

      notify('Akun berhasil dibuat.');
      navigate('/', { replace: true });
    } catch (error) {
      const apiError = error as ApiRequestError;

      // Server field names are PascalCase and nested paths use dots;
      // the last segment maps to the local form field.
      if (apiError.fieldErrors) {
        setErrors(
          Object.fromEntries(
            Object.entries(apiError.fieldErrors).map(([key, messages]) => {
              const field = key.split('.').pop()!;
              return [field.charAt(0).toLowerCase() + field.slice(1), messages[0]];
            }),
          ),
        );
        notify('Periksa kembali data yang diisi.', 'error');
      } else {
        notify(apiError.message, 'error');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Buat akun baru"
      subtitle="Isi data berikut untuk mulai belanja di BelanjaYuk."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          name="fullName"
          label="Nama Lengkap"
          placeholder="Nama sesuai identitas"
          value={form.fullName}
          error={errors.fullName}
          onChange={(e) => update('fullName')(e.target.value)}
        />

        <Input
          name="userName"
          label="Username"
          placeholder="belanjayuk_user"
          value={form.userName}
          error={errors.userName}
          onChange={(e) => update('userName')(e.target.value)}
        />

        <Input
          name="email"
          label="Email"
          type="email"
          placeholder="contoh@mail.com"
          value={form.email}
          error={errors.email}
          onChange={(e) => update('email')(e.target.value)}
        />

        <Input
          name="phoneNumber"
          label="No. HP"
          placeholder="08xxxx"
          value={form.phoneNumber}
          error={errors.phoneNumber}
          onChange={(e) => update('phoneNumber')(e.target.value)}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            name="password"
            label="Kata Sandi"
            type="password"
            placeholder="Minimal 8 karakter"
            value={form.password}
            error={errors.password}
            onChange={(e) => update('password')(e.target.value)}
          />
          <Input
            name="confirmPassword"
            label="Konfirmasi Sandi"
            type="password"
            placeholder="Ulangi sandi"
            value={form.confirmPassword}
            error={errors.confirmPassword}
            onChange={(e) => update('confirmPassword')(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            name="dateOfBirth"
            label="Tanggal Lahir"
            type="date"
            value={form.dateOfBirth}
            error={errors.dateOfBirth}
            onChange={(e) => update('dateOfBirth')(e.target.value)}
          />
          <Select
            name="idGender"
            label="Jenis Kelamin"
            value={form.idGender}
            error={errors.idGender}
            onChange={(e) => update('idGender')(e.target.value)}
            options={genders.map((g) => ({ value: g.id, label: g.name }))}
          />
        </div>

        <div className="rounded-xl border border-[var(--color-line)]">
          <button
            type="button"
            onClick={() => setShowAddress((v) => !v)}
            aria-expanded={showAddress}
            className="flex w-full items-center gap-2 px-4 py-3 text-sm font-semibold text-[var(--color-ink)]"
          >
            <svg
              viewBox="0 0 24 24"
              className={`size-3.5 transition-transform ${showAddress ? 'rotate-90' : ''}`}
              fill="currentColor"
            >
              <path d="m9 6 6 6-6 6Z" />
            </svg>
            Tambahkan alamat utama (opsional)
          </button>

          {showAddress && (
            <div className="space-y-4 border-t border-[var(--color-line)] p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  name="provinsi"
                  label="Provinsi"
                  placeholder="Banten"
                  value={form.provinsi}
                  error={errors.provinsi}
                  onChange={(e) => update('provinsi')(e.target.value)}
                />
                <Input
                  name="kotaKabupaten"
                  label="Kota/Kabupaten"
                  placeholder="Tangerang Kota"
                  value={form.kotaKabupaten}
                  error={errors.kotaKabupaten}
                  onChange={(e) => update('kotaKabupaten')(e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  name="kecamatan"
                  label="Kecamatan"
                  placeholder="Tangerang"
                  value={form.kecamatan}
                  error={errors.kecamatan}
                  onChange={(e) => update('kecamatan')(e.target.value)}
                />
                <Input
                  name="kodePos"
                  label="Kode Pos"
                  placeholder="15111"
                  inputMode="numeric"
                  maxLength={5}
                  value={form.kodePos}
                  error={errors.kodePos}
                  onChange={(e) => update('kodePos')(e.target.value.replace(/\D/g, ''))}
                />
              </div>

              <Input
                name="homeAddressDesc"
                label="Alamat Lengkap"
                placeholder="Jalan, blok, nomor rumah"
                value={form.homeAddressDesc}
                error={errors.homeAddressDesc}
                onChange={(e) => update('homeAddressDesc')(e.target.value)}
              />
            </div>
          )}
        </div>

        <label className="flex cursor-pointer items-start gap-2 text-sm text-[var(--color-muted)]">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 size-4 rounded border-[var(--color-line)] accent-brand-500"
          />
          Saya setuju dengan Syarat &amp; Kebijakan Privasi
        </label>

        <Button type="submit" loading={submitting} className="w-full">
          Buat Akun
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
        Sudah punya akun?{' '}
        <Link to="/login" className="font-semibold text-brand-500 hover:underline">
          Masuk
        </Link>
      </p>
    </AuthLayout>
  );
}
