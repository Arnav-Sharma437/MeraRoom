'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import type { AuthUser } from '@/types';

interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isOwner: boolean;
  isAdmin: boolean;
  login: (phone: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();

  const user: AuthUser | null = session?.user
    ? {
        id: session.user.id ?? '',
        name: session.user.name ?? '',
        email: session.user.email ?? '',
        role: (session.user as { role?: AuthUser['role'] }).role ?? 'user',
        avatar: (session.user as { avatar?: string }).avatar,
      }
    : null;

  const login = async (phone: string, password: string): Promise<boolean> => {
    const result = await signIn('credentials', {
      phone,
      password,
      redirect: false,
    });
    return result?.ok ?? false;
  };

  const logout = async () => {
    await signOut({ redirect: false });
  };

  return {
    user,
    isLoading: status === 'loading',
    isAuthenticated: !!session?.user,
    isOwner: user?.role === 'owner',
    isAdmin: user?.role === 'admin',
    login,
    logout,
  };
}
