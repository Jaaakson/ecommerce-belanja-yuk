import { createContext, useContext } from 'react';
import type { UserSummary } from '../api/types';

export interface AuthState {
  user: UserSummary | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string, remember: boolean) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

export interface RegisterPayload {
  fullName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string | null;
  idGender: string;
  primaryAddress: {
    provinsi: string;
    kotaKabupaten: string;
    kecamatan: string;
    kodePos: string;
    homeAddressDesc: string;
  } | null;
}

export const AuthContext = createContext<AuthState | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
