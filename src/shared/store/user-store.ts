import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/entities/user';

interface UserState extends User {
  isLoaded: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  getUser: () => User | null;
}

export const useUser = create<UserState>()(
  persist(
    (set, get) => ({
      id: 0,
      email: '',
      nickname: '',
      birthDate: '',
      gender: 'male',
      provider: '',
      isLoaded: false,

      setUser: (user: User) => {
        set({
          ...user,
          isLoaded: true,
        });
      },

      clearUser: () => {
        set({
          id: 0,
          email: '',
          nickname: '',
          birthDate: '',
          gender: 'male',
          provider: '',
          isLoaded: false,
        });
      },

      getUser: () => {
        const state = get();
        if (!state.id && !state.nickname) return null;
        return {
          id: state.id,
          email: state.email,
          nickname: state.nickname,
          birthDate: state.birthDate,
          gender: state.gender,
          provider: state.provider,
        };
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        id: state.id,
        email: state.email,
        nickname: state.nickname,
        birthDate: state.birthDate,
        gender: state.gender,
        provider: state.provider,
      }),
      onRehydrateStorage: () => () => {
        setTimeout(() => useUser.setState({ isLoaded: true }), 0);
      },
    }
  )
);
