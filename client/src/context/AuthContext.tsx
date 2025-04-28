import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/auth';
import { useAuthStore } from '@/hooks/use-auth';
import toast from 'react-hot-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  checkAuthStatus: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const { user, token, setUser, setToken } = useAuthStore();

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      if (token) {
        const userData = await authService.getCurrentUser();
        setUser(userData.data);
      }
    } catch (error) {
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const protectedRoutes = ['/posts/create', '/profile'];
      const authRoutes = ['/auth/login', '/auth/register'];

      if (
        protectedRoutes.some((route) => pathname.startsWith(route)) &&
        !user
      ) {
        toast.error('Please login');
        router.push('/auth/login');
      }

      if (authRoutes.includes(pathname) && user) {
        router.push('/profile');
      }
    }
  }, [pathname, user, isLoading]);

  const contextValue = {
    isAuthenticated: !!user,
    isLoading,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
