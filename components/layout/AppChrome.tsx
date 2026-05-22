'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import MobileTopBar from '@/components/layout/MobileTopBar';
import BottomNavBar from '@/components/layout/BottomNavBar';
import Footer from '@/components/layout/Footer';

const MINIMAL_CHROME_PREFIXES = ['/login', '/register', '/dashboard', '/admin'];

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const minimal = MINIMAL_CHROME_PREFIXES.some((p) => pathname.startsWith(p));

  if (minimal) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
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
