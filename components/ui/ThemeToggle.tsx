'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <span
        className={cn(
          'w-9 h-9 rounded-full bg-white/10 inline-block',
          className
        )}
      />
    );
  }

  const isDark = theme === 'dark';

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'rounded-full p-2 min-w-[44px] min-h-[44px] flex items-center justify-center',
        'bg-white/10 text-white transition-default',
        'hover:bg-brand-gold/20 hover:text-brand-gold',
        className
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.span
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </motion.span>
    </motion.button>
  );
}
