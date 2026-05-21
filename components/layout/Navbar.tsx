'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '@/constants';
import { cn } from '@/lib/utils';
import { slideDown } from '@/lib/animations';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <motion.header
      variants={slideDown}
      initial="hidden"
      animate="visible"
      className={cn(
        'sticky top-0 z-50 transition-default',
        scrolled
          ? 'bg-brand-dark/95 backdrop-blur-md shadow-lg'
          : 'bg-brand-dark'
      )}
    >
      <nav className="container mx-auto px-4 h-[60px] md:h-[70px] flex items-center justify-between gap-4">
        <Link href="/" className="flex-shrink-0">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <Image
              src="/meraroom-logo-dark.svg"
              alt="MeraRoom"
              width={160}
              height={46}
              priority
              className={cn(
                'h-9 w-auto md:h-11 transition-default',
                scrolled ? 'hidden md:block' : 'block'
              )}
            />
            <Image
              src="/meraroom-icon.svg"
              alt="MeraRoom"
              width={40}
              height={40}
              className={cn(
                'h-9 w-9 transition-default',
                scrolled ? 'block md:hidden' : 'hidden'
              )}
            />
          </motion.div>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative text-sm font-medium transition-default py-1',
                isActive(link.href)
                  ? 'text-brand-gold'
                  : 'text-white/80 hover:text-brand-gold'
              )}
            >
              {link.label}
              {isActive(link.href) && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-brand-gold rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/dashboard/owner"
            className="bg-brand-gold text-brand-dark font-semibold rounded-lg px-4 py-2 text-sm transition-default hover:brightness-110 hover:scale-[1.03] active:scale-[0.97]"
          >
            List Room
          </Link>
          <Link
            href="/login"
            className="border border-white/30 text-white rounded-lg px-4 py-2 text-sm font-medium transition-default hover:border-brand-gold hover:text-brand-gold"
          >
            Login
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-default"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="lg:hidden overflow-hidden border-t border-white/10 bg-brand-dark/98 backdrop-blur-md"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'py-3 px-4 rounded-lg text-base font-medium transition-default',
                    isActive(link.href)
                      ? 'text-brand-gold bg-brand-gold/10'
                      : 'text-white/80 hover:text-brand-gold hover:bg-white/5'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/10">
                <Link
                  href="/dashboard/owner"
                  className="bg-brand-gold text-brand-dark font-semibold rounded-lg px-4 py-3 text-center transition-default hover:brightness-110"
                >
                  List Room
                </Link>
                <Link
                  href="/login"
                  className="border border-white/30 text-white rounded-lg px-4 py-3 text-center font-medium transition-default hover:border-brand-gold hover:text-brand-gold"
                >
                  Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
