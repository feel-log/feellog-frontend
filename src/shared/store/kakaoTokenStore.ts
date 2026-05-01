import { create } from 'zustand';

interface LoginKakaoResponse {
  accessToken: string;
  refreshToken: string;
}

interface KakaoTokenState extends LoginKakaoResponse {
  isLoaded: boolean;
  setTokens: (tokens: LoginKakaoResponse) => void;
  clearTokens: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
}

export const useKakaoToken = create<KakaoTokenState>((set, get) => ({
  accessToken: '',
  refreshToken: '',
  isLoaded: false,

  setTokens: (tokens: LoginKakaoResponse) => {
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
}));
