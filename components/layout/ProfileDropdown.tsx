'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserRole } from '@/models/User';

interface MenuItem {
  href?: string;
  label: string;
  icon: string;
  onClick?: () => void;
  danger?: boolean;
}

interface ProfileDropdownProps {
  name: string;
  role: UserRole;
}

export default function ProfileDropdown({ name, role }: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initial = name?.charAt(0)?.toUpperCase() ?? 'U';

  const items: MenuItem[] =
    role === 'admin'
      ? [
          { href: '/admin', label: 'Admin Panel', icon: '⚙️' },
          { href: '/dashboard/user', label: 'My Profile', icon: '👤' },
        ]
      : role === 'owner'
        ? [
            { href: '/dashboard/owner', label: 'My Listings', icon: '🏠' },
            { href: '/dashboard/owner/post', label: 'Post New Room', icon: '➕' },
            { href: '/dashboard/owner/inquiries', label: 'Inquiries', icon: '📩' },
          ]
        : [
            { href: '/dashboard/user', label: 'My Profile', icon: '👤' },
            { href: '/dashboard/user#saved', label: 'Saved Rooms', icon: '❤️' },
          ];

  const handleLogout = () => {
    setOpen(false);
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="relative" ref={ref}>
      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen((v) => !v)}
        className="w-9 h-9 rounded-full bg-[#0F2E1E] text-[#D4AF37] font-display text-lg flex items-center justify-center cursor-pointer border-2 border-[#D4AF37]/30"
        aria-label="Profile menu"
      >
        {initial}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-12 right-0 bg-white dark:bg-[#111A11] rounded-2xl shadow-xl border border-gray-100 dark:border-[#1F2E1F] p-2 min-w-[200px] z-50"
          >
            <p className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-[#1F2E1F] mb-1">
              {name}
            </p>
            {items.map((item) =>
              item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-[#F0FDF4] dark:hover:bg-[#0F2E1E]/30 text-[#0F2E1E] dark:text-white hover:text-[#16A34A] transition-default"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              ) : null
            )}
            <div className="border-t border-gray-100 dark:border-[#1F2E1F] my-1" />
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-default"
            >
              <span>🚪</span>
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
