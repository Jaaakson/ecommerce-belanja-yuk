import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { ApiRequestError } from '../../api/client';
import { lookupsApi } from '../../api/lookups';
import type { LookupItem } from '../../api/types';
import { Button } from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import { Collapse } from '../../components/ui/Collapse';
import { Input, PasswordInput } from '../../components/ui/Input';
import { DatePicker } from '../../components/ui/DatePicker';
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

type FormField = keyof typeof emptyForm;

/** Mirrors the server rule (minimum 8 characters) plus variety as a nudge. */
function scorePassword(value: string) {
  if (!value) return { level: 0, label: '', tone: '' };

  let score = 0;
  if (value.length >= 8) score += 1;
  if (value.length >= 12) score += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value) && /[^\w\s]/.test(value)) score += 1;

  if (score <= 1) return { level: 1, label: 'Lemah', tone: 'bg-critical' };
  if (score === 2) return { level: 2, label: 'Cukup', tone: 'bg-caution' };
  if (score === 3) return { level: 3, label: 'Kuat', tone: 'bg-brand-500' };
  return { level: 4, label: 'Sangat kuat', tone: 'bg-positive' };
}

export function RegisterPage() {
  const { register } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [genders, setGenders] = useState<LookupItem[]>([]);
  const [withAddress, setWithAddress] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void lookupsApi
      .genders()
      .then((result) => {
        if (!cancelled) setGenders(result);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  function update(field: FormField, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    // Clearing on edit keeps a stale server message from contradicting what
    // the user is currently typing.
    setErrors((current) => (current[field] ? { ...current, [field]: '' } : current));
  }

  const strength = scorePassword(form.password);
  const passwordsMatch =
    form.confirmPassword.length > 0 && form.password === form.confirmPassword;

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
        primaryAddress: withAddress
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
    <AuthLayout title="Buat akun baru" subtitle="Isi data berikut untuk mulai belanja.">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          name="fullName"
          label="Nama Lengkap"
          placeholder="Nama sesuai identitas"
          value={form.fullName}
          error={errors.fullName}
          onChange={(event) => update('fullName', event.target.value)}
          autoComplete="name"
        />

        <Input
          name="userName"
          label="Username"
          placeholder="belanjayuk_user"
          hint="5–30 karakter, harus unik"
          value={form.userName}
          error={errors.userName}
          onChange={(event) => update('userName', event.target.value)}
          autoComplete="username"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            name="email"
            label="Email"
            type="email"
            placeholder="contoh@mail.com"
            value={form.email}
            error={errors.email}
            onChange={(event) => update('email', event.target.value)}
            autoComplete="email"
          />
          <Input
            name="phoneNumber"
            label="No. HP"
            inputMode="tel"
            placeholder="08xxxxxxxxxx"
            value={form.phoneNumber}
            error={errors.phoneNumber}
            onChange={(event) => update('phoneNumber', event.target.value)}
            autoComplete="tel"
          />
        </div>

        <div>
          <PasswordInput
            name="password"
            label="Kata Sandi"
            placeholder="Minimal 8 karakter"
            value={form.password}
            error={errors.password}
            onChange={(event) => update('password', event.target.value)}
            autoComplete="new-password"
          />

          {form.password && !errors.password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex flex-1 gap-1">
                {[1, 2, 3, 4].map((step) => (
                  <span
                    key={step}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      step <= strength.level ? strength.tone : 'bg-line'
                    }`}
                  />
                ))}
              </div>
              <span className="w-20 text-right text-2xs font-medium text-ink-faint">
                {strength.label}
              </span>
            </div>
          )}
        </div>

        <PasswordInput
          name="confirmPassword"
          label="Konfirmasi Sandi"
          placeholder="Ulangi kata sandi"
          value={form.confirmPassword}
          error={errors.confirmPassword}
          hint={passwordsMatch ? 'Kata sandi cocok.' : undefined}
          onChange={(event) => update('confirmPassword', event.target.value)}
          autoComplete="new-password"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <DatePicker
            label="Tanggal Lahir"
            value={form.dateOfBirth}
            error={errors.dateOfBirth}
            onChange={(value) => update('dateOfBirth', value)}
          />
          <Select
            name="idGender"
            label="Jenis Kelamin"
            value={form.idGender}
            error={errors.idGender}
            onChange={(event) => update('idGender', event.target.value)}
            options={genders.map((gender) => ({ value: gender.id, label: gender.name }))}
          />
        </div>

        <Collapse title="Alamat utama" hint="Opsional, bisa diisi nanti">
          <Checkbox
            checked={withAddress}
            onChange={(event) => setWithAddress(event.target.checked)}
          >
            Simpan alamat ini sebagai alamat utama
          </Checkbox>

          <div className={withAddress ? 'space-y-4' : 'space-y-4 opacity-50'}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                name="provinsi"
                label="Provinsi"
                placeholder="Banten"
                disabled={!withAddress}
                value={form.provinsi}
                error={errors.provinsi}
                onChange={(event) => update('provinsi', event.target.value)}
              />
              <Input
                name="kotaKabupaten"
                label="Kota/Kabupaten"
                placeholder="Tangerang Kota"
                disabled={!withAddress}
                value={form.kotaKabupaten}
                error={errors.kotaKabupaten}
                onChange={(event) => update('kotaKabupaten', event.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                name="kecamatan"
                label="Kecamatan"
                placeholder="Tangerang"
                disabled={!withAddress}
                value={form.kecamatan}
                error={errors.kecamatan}
                onChange={(event) => update('kecamatan', event.target.value)}
              />
              <Input
                name="kodePos"
                label="Kode Pos"
                inputMode="numeric"
                maxLength={5}
                placeholder="15111"
                disabled={!withAddress}
                value={form.kodePos}
                error={errors.kodePos}
                onChange={(event) => update('kodePos', event.target.value.replace(/\D/g, ''))}
              />
            </div>

            <Input
              name="homeAddressDesc"
              label="Alamat Lengkap"
              placeholder="Jalan, blok, nomor rumah"
              disabled={!withAddress}
              value={form.homeAddressDesc}
              error={errors.homeAddressDesc}
              onChange={(event) => update('homeAddressDesc', event.target.value)}
            />
          </div>
        </Collapse>

        <Checkbox checked={agreed} onChange={(event) => setAgreed(event.target.checked)}>
          Saya setuju dengan Syarat &amp; Kebijakan Privasi
        </Checkbox>

        <Button type="submit" size="lg" loading={submitting} fullWidth>
          Buat Akun
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Sudah punya akun?{' '}
        <Link
          to="/login"
          className="font-semibold text-brand-500 underline-offset-4 transition-colors duration-150 hover:text-brand-600 hover:underline"
        >
          Masuk
        </Link>
      </p>
    </AuthLayout>
  );
}
