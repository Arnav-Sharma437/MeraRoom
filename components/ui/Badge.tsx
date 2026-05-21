import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'gold' | 'success' | 'warning';
  className?: string;
}

export default function Badge({
  children,
  variant = 'default',
  className,
}: BadgeProps) {
  const variants = {
    default: 'bg-brand-light text-brand-green border-brand-border',
    gold: 'bg-brand-gold/20 text-brand-dark border-brand-gold',
    success: 'bg-brand-green text-white',
    warning: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
