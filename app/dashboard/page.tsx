'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Loader from '@/components/ui/Loader';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      router.replace('/login');
      return;
    }

    const role = (session.user as { role?: string }).role;
    router.replace(role === 'owner' ? '/dashboard/owner' : '/dashboard/user');
  }, [session, status, router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <Loader />
    </div>
  );
}
