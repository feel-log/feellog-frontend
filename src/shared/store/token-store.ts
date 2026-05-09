import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LoginResponse } from '@/features/login/api/login-api';

interface tokenState extends LoginResponse {
  isLoaded: boolean;
  errorBox: boolean;
  setTokens: (tokens: LoginResponse) => void;
  clearTokens: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setErrorBox: (isOpen: boolean) => void;
  toggleErrorBox: () => void;
}

export const useToken = create<tokenState>()(
  persist(
    (set, get) => ({
      accessToken: '',
      refreshToken: '',
      isLoaded: false,
      errorBox: false,

      setTokens: (tokens: LoginResponse) => {
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isLoaded: true,
          errorBox: false
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

      setErrorBox: (isOpen: boolean) => {
        set({ errorBox: isOpen });
      },

      toggleErrorBox: () => {
        const state = get();
        set({ errorBox: !state.errorBox });
      },
    }),
    {
      name: 'token-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => () => {
        setTimeout(() => useToken.setState({ isLoaded: true }), 0);
      },
    }
  )
);
