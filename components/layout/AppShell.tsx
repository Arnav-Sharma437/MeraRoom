'use client';

import type { ReactNode } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileTopBar from '@/components/layout/MobileTopBar';
import BottomNavBar from '@/components/layout/BottomNavBar';

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <MobileTopBar />
      <Navbar />
      <main className="flex-1 pt-14 md:pt-0 pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
        {children}
      </main>
      <Footer />
      <BottomNavBar />
    </>
  );
}
