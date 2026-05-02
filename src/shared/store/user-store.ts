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
      id: '',
      email: '',
      nickname: '',
      birthDate: '',
      gender: '',
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
          id: '',
          email: '',
          nickname: '',
          birthDate: '',
          gender: '',
          provider: '',
          isLoaded: false,
        });
      },

      getUser: () => {
        const state = get();
        return state.isLoaded
          ? {
              id: state.id,
              email: state.email,
              nickname: state.nickname,
              birthDate: state.birthDate,
              gender: state.gender,
              provider: state.provider,
            }
          : null;
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
    }
  )
);
