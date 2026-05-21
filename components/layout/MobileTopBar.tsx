'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function MobileTopBar() {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 pt-safe bg-brand-dark dark:bg-brand-dark-deep">
      <div className="flex items-center justify-between h-14 px-4">
        <Link href="/" className="flex items-center gap-2 min-h-[44px]">
          <Image
            src="/meraroom-icon.svg"
            alt="MeraRoom"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="font-display text-lg text-white">
            Mera<span className="text-brand-gold">Room</span>
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-white/80 hover:text-brand-gold transition-default"
            aria-label="Notifications"
          >
            <Bell size={22} />
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
