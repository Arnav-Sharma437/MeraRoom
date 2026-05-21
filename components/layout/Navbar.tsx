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
        'sticky top-0 z-50 h-[70px] transition-all duration-200',
        scrolled
          ? 'bg-[#0F2E1E]/95 backdrop-blur-md shadow-lg'
          : 'bg-[#0F2E1E]'
      )}
    >
      <nav className="container mx-auto px-4 h-[70px] flex items-center justify-between gap-6">
        <Link href="/" className="flex-shrink-0">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <Image
              src="/meraroom-logo-dark.svg"
              alt="MeraRoom"
              width={150}
              height={43}
              priority
              className="h-[43px] w-auto"
            />
          </motion.div>
        </Link>

        <div className="flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative text-sm font-medium font-sans transition-colors duration-200 py-2',
                isActive(link.href)
                  ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
                  : 'text-white/70 hover:text-[#D4AF37]'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="border border-white/30 text-white text-sm rounded-lg px-4 py-2 min-h-[44px] flex items-center font-medium transition-colors duration-200 hover:border-[#D4AF37] hover:text-[#D4AF37]"
          >
            Login
          </Link>
          <Link
            href="/dashboard/owner"
            className="bg-[#D4AF37] text-[#0F2E1E] font-semibold text-sm rounded-lg px-4 py-2 min-h-[44px] flex items-center transition-all duration-200 hover:brightness-110"
          >
            Post Room
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
