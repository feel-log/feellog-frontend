import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LoginResponse } from '@/features/login/api/login-api';
import { logAuthDebug, summarizeTokens } from '@/shared/utils/auth-debug';

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
        logAuthDebug('token store setTokens called', summarizeTokens(tokens));

        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isLoaded: true,
          errorBox: false
        });

        logAuthDebug('token store state updated', summarizeTokens(get()));

        if (typeof window !== 'undefined') {
          setTimeout(() => {
            try {
              const persisted = JSON.parse(localStorage.getItem('token-storage') ?? '{}');
              logAuthDebug(
                'localStorage persistence checked',
                summarizeTokens(persisted?.state),
              );
            } catch (error) {
              console.error('[Auth Debug] localStorage persistence parse failed', error);
            }
          }, 0);
        }
      },

      clearTokens: () => {
        console.warn('[Auth Debug] clearTokens called');
        set({
          accessToken: '',
          refreshToken: '',
          isLoaded: true,
          errorBox: false,
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
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('[Auth Debug] token store rehydration failed', error);
        } else {
          logAuthDebug('token store rehydrated', summarizeTokens(state));
        }
        setTimeout(() => useToken.setState({ isLoaded: true }), 0);
      },
    }
  )
);
