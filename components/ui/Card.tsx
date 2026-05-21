import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-brand-border shadow-card',
        hover && 'transition-default hover:shadow-card-hover hover:-translate-y-1.5',
        className
      )}
    >
      {children}
    </div>
  );
}
