'use client';

import { cn } from '@/lib/utils';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Loader({ size = 'md', className }: LoaderProps) {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div
      className={cn('flex items-center justify-center', className)}
      role="status"
      aria-label="Loading"
    >
      <div
        className={cn(
          'rounded-full border-brand-green border-t-transparent animate-spin',
          sizes[size]
        )}
      />
    </div>
  );
}
