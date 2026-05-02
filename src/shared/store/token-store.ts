import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LoginResponse } from '@/features/login/api/login-api';

interface tokenState extends LoginResponse {
  isLoaded: boolean;
  setTokens: (tokens: LoginResponse) => void;
  clearTokens: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
}

export const useToken = create<tokenState>()(
  persist(
    (set, get) => ({
      accessToken: '',
      refreshToken: '',
      isLoaded: false,

      setTokens: (tokens: LoginResponse) => {
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isLoaded: true,
        });
      },

      clearTokens: () => {
        set({
          accessToken: '',
          refreshToken: '',
          isLoaded: false,
        });
      },

      getAccessToken: () => {
        const state = get();
        return state.accessToken || null;
      },

      getRefreshToken: () => {
        const state = get();
        return state.refreshToken || null;
      },
    }),
    {
      name: 'token-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
