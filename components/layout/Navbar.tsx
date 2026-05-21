'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { NAV_LINKS } from '@/constants';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';
import { slideDown } from '@/lib/animations';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
        'hidden md:block sticky top-0 z-50 transition-default',
        scrolled
          ? 'bg-brand-dark/95 dark:bg-brand-dark-deep/95 backdrop-blur-md shadow-lg'
          : 'bg-brand-dark dark:bg-brand-dark-deep'
      )}
    >
      <nav className="container mx-auto px-4 h-[70px] flex items-center justify-between gap-4">
        <Link href="/" className="flex-shrink-0">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <Image
              src="/meraroom-logo-dark.svg"
              alt="MeraRoom"
              width={160}
              height={46}
              priority
              className="h-11 w-auto"
            />
          </motion.div>
        </Link>

        <div className="flex items-center gap-8">
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

        <div className="flex items-center gap-3">
          <ThemeToggle />
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
      </nav>
    </motion.header>
  );
}
