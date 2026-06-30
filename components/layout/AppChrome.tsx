'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import MobileTopBar from '@/components/layout/MobileTopBar';
import BottomNavBar from '@/components/layout/BottomNavBar';
import Footer from '@/components/layout/Footer';
import AnnouncementBar from '@/components/layout/AnnouncementBar';

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const minimal =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/dashboard/owner');

  if (minimal) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <AnnouncementBar />
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="block md:hidden">
        <MobileTopBar />
      </div>
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer />
      <div className="block md:hidden">
        <BottomNavBar />
      </div>
    </>
  );
}
