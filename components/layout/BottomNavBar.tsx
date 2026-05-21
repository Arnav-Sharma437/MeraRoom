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
] as const;

export default function BottomNavBar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-white dark:bg-[#111A11] border-t border-gray-200 dark:border-[#1F2E1F] pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-end justify-around h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.href);

          if ('center' in tab && tab.center) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex flex-col items-center -mt-5 min-w-[44px]"
              >
                <motion.span
                  whileTap={{ scale: 0.85 }}
                  className="w-14 h-14 rounded-full bg-[#16A34A] text-white flex items-center justify-center shadow-lg shadow-[#16A34A]/50 border-4 border-white dark:border-[#111A11]"
                >
                  <Icon size={26} strokeWidth={2.5} />
                </motion.span>
                <span className="text-xs text-[#16A34A] font-medium mt-1">
                  {tab.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] flex-1 max-w-[72px]"
            >
              <motion.div
                whileTap={{ scale: 0.85 }}
                className="flex flex-col items-center"
              >
                <Icon
                  size={22}
                  className={cn(
                    active
                      ? 'text-[#16A34A]'
                      : 'text-gray-400 dark:text-gray-600'
                  )}
                />
                <span
                  className={cn(
                    'text-xs mt-0.5',
                    active
                      ? 'text-[#16A34A] font-semibold'
                      : 'text-gray-400 dark:text-gray-600'
                  )}
                >
                  {tab.label}
                </span>
                {active && (
                  <span className="w-1 h-1 rounded-full bg-[#16A34A] mx-auto mt-0.5" />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
