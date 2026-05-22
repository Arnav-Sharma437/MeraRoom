import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { UserRole } from '@/models/User';

export async function getAuthSession() {
  return getServerSession(authOptions);
}

export async function requireSession() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return null;
  }
  return session;
}

export function getSessionRole(session: { user: { role?: UserRole } }): UserRole {
  return session.user.role ?? 'user';
}
