import axios, { AxiosError } from 'axios';
import type { ApiErrorBody, ApiResponse } from './types';

const TOKEN_KEY = 'belanjayuk.token';
const EXPIRY_KEY = 'belanjayuk.expiresAt';

export const tokenStorage = {
  read(): string | null {
    const token = localStorage.getItem(TOKEN_KEY);
    const expiresAt = localStorage.getItem(EXPIRY_KEY);

    if (!token || !expiresAt) return null;

    // Discard expired tokens locally so the UI does not flash a logged-in
    // state before the first 401 arrives.
    if (new Date(expiresAt).getTime() <= Date.now()) {
      tokenStorage.clear();
      return null;
    }

    return token;
  },
  write(token: string, expiresAt: string) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(EXPIRY_KEY, expiresAt);
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRY_KEY);
  },
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.read();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Unwraps the ApiResponse envelope so callers work with plain data. */
export async function unwrap<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const response = await promise;
  return response.data.data as T;
}

export class ApiRequestError extends Error {
  status: number;
  fieldErrors?: Record<string, string[]>;

  constructor(message: string, status: number, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

/** Turns an axios failure into a message the interface can display as-is. */
export function toApiError(error: unknown): ApiRequestError {
  if (error instanceof AxiosError) {
    const body = error.response?.data as ApiErrorBody | undefined;

    if (body?.message) {
      return new ApiRequestError(body.message, error.response!.status, body.errors);
    }

    if (!error.response) {
      return new ApiRequestError('Tidak bisa terhubung ke server.', 0);
    }
  }

  return new ApiRequestError('Terjadi kesalahan. Coba lagi.', 500);
}

export const formatRupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);