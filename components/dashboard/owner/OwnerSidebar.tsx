'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { LogOut, Globe } from 'lucide-react';
import { OWNER_NAV } from '@/constants';
import { LucideByName } from '@/components/ui/LucideByName';
import { cn } from '@/lib/utils';

export default function OwnerSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const name = session?.user?.name ?? 'Owner';
  const initial = name.charAt(0).toUpperCase();

  const isActive = (href: string) => {
    if (href === '/dashboard/owner') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#0F2E1E] h-screen sticky top-0 shrink-0">
      <div className="p-6 border-b border-white/10">
        <Image
          src="/meraroom-logo-dark.svg"
          alt="MeraRoom"
          width={140}
          height={40}
          className="h-9 w-auto mb-6"
        />
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-display text-xl flex items-center justify-center">
            {initial}
          </div>
          <div>
            <p className="text-white font-semibold text-sm truncate max-w-[140px]">{name}</p>
            <p className="text-[#D4AF37] text-xs">Property Owner</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4">
        {OWNER_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-6 py-3 text-sm font-medium transition-default border-r-[3px]',
              isActive(item.href)
                ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]'
                : 'text-white/60 border-transparent hover:bg-white/5 hover:text-white'
            )}
          >
            <LucideByName name={item.icon} size={18} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t border-white/10 space-y-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-default"
        >
          <Globe size={16} />
          Visit Website
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-2 text-red-400 text-sm font-medium hover:text-red-300 transition-default w-full"
        >
          <LogOut size={16} />
          Logout
        </button>
        <p className="text-white/30 text-xs">MeraRoom v1.0</p>
      </div>
    </aside>
  );
}
