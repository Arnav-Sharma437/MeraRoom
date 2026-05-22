'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WhatsAppButtonProps {
  href: string;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function WhatsAppButton({
  href,
  label = 'Chat on WhatsApp',
  className,
  size = 'md',
  showLabel = true,
}: WhatsAppButtonProps) {
  const sizes = {
    sm: 'p-2.5 rounded-xl',
    md: 'py-3 px-4 rounded-xl text-sm',
    lg: 'py-4 rounded-2xl text-base w-full',
  };

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold transition-default whatsapp-pulse',
        sizes[size],
        className
      )}
    >
      <MessageCircle size={size === 'lg' ? 22 : 18} />
      {showLabel && label}
    </motion.a>
  );
}
