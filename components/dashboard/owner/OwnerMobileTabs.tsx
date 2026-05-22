'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const TABS = [
  { href: '/dashboard/owner', label: 'Overview' },
  { href: '/dashboard/owner/listings', label: 'Listings' },
  { href: '/dashboard/owner/post', label: 'Post' },
  { href: '/dashboard/owner/inquiries', label: 'Inquiries' },
] as const;

export default function OwnerMobileTabs() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard/owner') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="lg:hidden bg-[#0F2E1E] px-4 py-3 overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 min-w-max">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-semibold whitespace-nowrap transition-default',
              isActive(tab.href)
                ? 'bg-[#D4AF37] text-[#0F2E1E]'
                : 'text-white/60 hover:text-white'
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
