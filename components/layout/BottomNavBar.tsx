'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Search, Plus, Heart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/dashboard/owner', label: 'Post', icon: Plus, center: true },
  { href: '/dashboard/user', label: 'Saved', icon: Heart },
  { href: '/login', label: 'Profile', icon: User },
];

export default function BottomNavBar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-surface-card-dark border-t border-gray-200 dark:border-[#1F2E1F] pb-safe">
      <div className="flex items-end justify-around h-16 px-2 relative">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.href);

          if (tab.center) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="relative -top-4 flex flex-col items-center"
              >
                <motion.span
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 rounded-full bg-brand-green text-white flex items-center justify-center shadow-lg shadow-brand-green/40 border-4 border-white dark:border-surface-card-dark"
                >
                  <Icon size={26} strokeWidth={2.5} />
                </motion.span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-0.5"
            >
              <motion.span
                animate={active ? { scale: 1.15 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon
                  size={22}
                  className={cn(
                    active ? 'text-brand-green' : 'text-gray-400 dark:text-gray-500'
                  )}
                />
              </motion.span>
              <span
                className={cn(
                  'text-[10px]',
                  active
                    ? 'text-brand-green font-semibold'
                    : 'text-gray-400 dark:text-gray-500'
                )}
              >
                {tab.label}
              </span>
              {active && (
                <span className="w-1 h-1 rounded-full bg-brand-green mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
