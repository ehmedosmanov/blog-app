import { authService } from '@/services/auth';
import { User } from '@/services/auth/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<User>;
  register: (
    name: string,
    surname: string,
    email: string,
    password: string
  ) => Promise<User>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await authService.login(email, password);
          const { access_token } = response.data;
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', access_token);
          }
          const responseUser = await authService.getCurrentUser();
          const user = responseUser.data;
          set({ user, token: access_token, isLoading: false });
          return user;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (name, surname, email, password) => {
        set({ isLoading: true });
        try {
          const response = await authService.register(
            name,
            surname,
            email,
            password
          );
          const { access_token } = response.data;
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', access_token);
          }
          const responseUser = await authService.getCurrentUser();
          const user = responseUser.data;
          set({ user, token: access_token, isLoading: false });
          return user;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
