'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Search, Info, Phone, BarChart2 } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/models/User';

const MOBILE_NAV_ITEMS = [
  { href: '/', label: 'Home', Icon: Home },
  { href: '/search', label: 'Search Rooms', Icon: Search },
  { href: '/about', label: 'About', Icon: Info },
  { href: '/contact', label: 'Contact', Icon: Phone },
] as const;

export default function MobileTopBar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const role = (session?.user as { role?: UserRole })?.role;
  const isLoggedIn = !!session?.user;

  const listRoomHref = isLoggedIn && role === 'owner' ? '/dashboard/owner/post' : '/register?role=owner';

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (event: Event) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div ref={menuRef} className="sticky top-0 z-50 bg-[#0F2E1E]">
      <header className="h-14 px-4 flex items-center justify-between">
        <Link href="/" onClick={closeMenu} className="flex items-center gap-2 min-h-[44px]">
          <Image src="/meraroom-icon.svg" alt="MeraRoom" width={32} height={32} className="w-8 h-8" />
          <span className="font-sans text-lg font-bold">
            <span className="text-white">Mera</span>
            <span className="text-[#D4AF37]">Room</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-white rounded-full hover:text-[#D4AF37]"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 bg-[#0F2E1E]"
          >
            <nav className="flex flex-col">
              {MOBILE_NAV_ITEMS.map((link) => {
                const Icon = link.Icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className={cn(
                      'py-3 px-4 font-medium text-white/80 border-b border-white/5 min-h-[44px] flex items-center gap-2',
                      isActive(link.href) && 'text-[#D4AF37] border-l-[3px] border-l-[#D4AF37] bg-white/5'
                    )}
                  >
                    <Icon size={18} />
                    {link.label}
                  </Link>
                );
              })}
              {isLoggedIn && role === 'owner' && (
                <Link
                  href="/dashboard/owner"
                  onClick={closeMenu}
                  className="py-3 px-4 font-medium text-white/80 border-b border-white/5 flex items-center gap-2"
                >
                  <BarChart2 size={18} />
                  My Dashboard
                </Link>
              )}
            </nav>

            <div className="flex gap-3 p-4 border-t border-white/10">
              {!isLoggedIn ? (
                <>
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="flex-1 border border-white/30 text-white rounded-lg py-2.5 text-center text-sm font-medium min-h-[44px] flex items-center justify-center"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register?role=owner"
                    onClick={closeMenu}
                    className="flex-1 bg-[#D4AF37] text-[#0F2E1E] font-semibold rounded-lg py-2.5 text-center text-sm min-h-[44px] flex items-center justify-center"
                  >
                    Post Room Free
                  </Link>
                </>
              ) : (
                <Link
                  href={listRoomHref}
                  onClick={closeMenu}
                  className="flex-1 bg-[#D4AF37] text-[#0F2E1E] font-semibold rounded-lg py-2.5 text-center text-sm min-h-[44px] flex items-center justify-center"
                >
                  {role === 'owner' ? 'Post Room' : 'List Your Room'}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
