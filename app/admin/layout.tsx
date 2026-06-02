'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart2,
  Home,
  CheckSquare,
  MessageCircle,
  MessageSquare,
  Star,
  Shield,
  Megaphone,
  MapPin,
  CreditCard,
  FileText,
  Settings,
  Globe,
  LogOut,
  Bell,
  MoreHorizontal,
  X,
  Users,
  Users2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/admin', label: 'Overview', icon: BarChart2 },
  { href: '/admin/rooms', label: 'Rooms', icon: Home },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/approvals', label: 'Approvals', icon: CheckSquare, badgeKey: 'pendingRooms' },
  { href: '/admin/inquiries', label: 'Inquiries', icon: MessageCircle, badgeKey: 'inquiriesToday' },
  { href: '/admin/contacts', label: 'Contact Messages', icon: MessageSquare, badgeKey: 'unreadContacts' },
  { href: '/admin/featured', label: 'Featured', icon: Star },
  { href: '/admin/verified', label: 'Verified', icon: Shield },
  { href: '/admin/ads', label: 'Advertisements', icon: Megaphone },
  { href: '/admin/locations', label: 'Locations', icon: MapPin },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/team', label: 'Team', icon: Users2 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [badges, setBadges] = useState<Record<string, number>>({ pendingRooms: 0, inquiriesToday: 0, unreadContacts: 0 });
  const [moreOpen, setMoreOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const name = session?.user?.name ?? 'Admin';
  const email = session?.user?.email ?? 'admin@meraroom.com';

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/admin/stats');
        const json = await res.json();
        if (json.success && json.data?.stats) {
          setBadges({
            pendingRooms: json.data.stats.pendingRooms ?? 0,
            inquiriesToday: json.data.stats.inquiriesToday ?? 0,
            unreadContacts: json.data.stats.unreadContacts ?? 0,
          });
        }
      } catch (err) {
        console.error('Failed to load admin badges', err);
      }
    }
    loadStats();
    const interval = setInterval(loadStats, 30000); // refresh badges every 30s
    return () => clearInterval(interval);
  }, []);

  // Close more menu on route change
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  // Click outside to close drawer
  useEffect(() => {
    if (!moreOpen) return;
    const clickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, [moreOpen]);

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === href;
    return pathname.startsWith(href);
  };

  const getBadgeValue = (item: (typeof NAV_ITEMS)[number]) => {
    if (!item.badgeKey) return 0;
    return badges[item.badgeKey] ?? 0;
  };

  // Mobile Bottom Tabs: Overview, Rooms, Approvals, Inquiries, More
  const mobileMainItems = NAV_ITEMS.slice(0, 4);
  const mobileMoreItems = NAV_ITEMS.slice(4);

  return (
    <div className="min-h-screen bg-[#F9F6EF] dark:bg-[#0A0F0A] flex flex-col md:flex-row text-brand-black dark:text-white">
      {/* Desktop/Tablet Sidebar */}
      <aside className="hidden md:flex flex-col bg-[#0F2E1E] h-screen sticky top-0 shrink-0 transition-all duration-300 md:w-16 lg:w-64 border-r border-white/10 z-30">
        {/* Top Header */}
        <div className="p-4 lg:p-6 border-b border-white/10 flex flex-col items-center lg:items-start gap-4">
          <Link href="/admin" className="flex items-center gap-2">
            <Image
              src="/meraroom-icon.svg"
              alt="MeraRoom"
              width={36}
              height={36}
              className="w-9 h-9"
            />
            <span className="font-display text-lg font-bold text-white hidden lg:inline">
              Mera<span className="text-[#D4AF37]">Room</span>
            </span>
          </Link>
          <div className="hidden lg:inline-flex items-center bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 rounded-full px-3 py-1 text-xs font-semibold">
            Admin Panel
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 overflow-y-auto space-y-1 hide-scrollbar">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const badge = getBadgeValue(item);

            return (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setHoveredTab(item.href)}
                onMouseLeave={() => setHoveredTab(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-sm font-medium transition-all relative group',
                    active
                      ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/20'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <Icon size={18} className="shrink-0" />
                  <span className="hidden lg:inline truncate">{item.label}</span>

                  {/* Badge */}
                  {badge > 0 && (
                    <span className="absolute right-3 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {badge}
                    </span>
                  )}
                </Link>

                {/* Tablet Tooltip */}
                <AnimatePresence>
                  {hoveredTab === item.href && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 20 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="absolute left-12 top-2 z-50 bg-[#0F2E1E] text-white border border-white/10 rounded-md px-3 py-1.5 text-xs font-medium lg:hidden shadow-xl pointer-events-none whitespace-nowrap"
                    >
                      {item.label}
                      {badge > 0 && ` (${badge})`}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-3 flex flex-col items-center lg:items-start text-xs text-white/40">
          <div className="hidden lg:block truncate w-full">
            <p className="font-semibold text-white truncate">{name}</p>
            <p className="text-white/50 text-[10px] truncate">{email}</p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 hover:text-white transition-default"
            title="Visit Site"
          >
            <Globe size={16} />
            <span className="hidden lg:inline">Visit Website →</span>
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 font-medium transition-default w-full justify-center lg:justify-start"
            title="Logout"
          >
            <LogOut size={16} />
            <span className="hidden lg:inline">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header Top Bar */}
      <header className="md:hidden sticky top-0 z-40 bg-[#0F2E1E] h-14 px-4 flex items-center justify-between border-b border-white/10 shadow-md">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/meraroom-icon.svg"
            alt="MeraRoom"
            width={28}
            height={28}
            className="w-7 h-7"
          />
          <span className="font-display text-base font-bold text-white">
            MeraRoom <span className="text-[#D4AF37] text-xs px-2 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/20 font-semibold ml-1">Admin</span>
          </span>
        </Link>
        <button
          type="button"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-white/80 hover:text-white"
          onClick={() => router.push('/admin/settings')}
        >
          <Bell size={20} />
        </button>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0 h-screen overflow-y-auto">
        <div className="p-4 md:p-8 flex-1">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Tabs Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0F2E1E] border-t border-white/10 h-16 px-2 flex justify-around items-center pb-safe">
        {mobileMainItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const badge = getBadgeValue(item);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full text-xs gap-1 font-medium transition-all relative',
                active ? 'text-[#D4AF37]' : 'text-white/60'
              )}
            >
              <Icon size={20} />
              <span>{item.label}</span>
              {badge > 0 && (
                <span className="absolute top-1 right-5 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* More Tab Trigger */}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className={cn(
            'flex flex-col items-center justify-center flex-1 h-full text-xs gap-1 font-medium transition-all',
            moreOpen ? 'text-[#D4AF37]' : 'text-white/60'
          )}
        >
          <MoreHorizontal size={20} />
          <span>More</span>
        </button>
      </nav>

      {/* Mobile More Slide-up Drawer */}
      <AnimatePresence>
        {moreOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-50 bg-black"
              onClick={() => setMoreOpen(false)}
            />

            {/* Bottom Drawer */}
            <motion.div
              ref={drawerRef}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0F2E1E] rounded-t-3xl border-t border-white/10 max-h-[75vh] overflow-y-auto pb-8 pt-4 px-6 flex flex-col"
            >
              {/* Drag Handle indicator */}
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" />

              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <span className="font-semibold text-white">More Navigation</span>
                <button
                  type="button"
                  onClick={() => setMoreOpen(false)}
                  className="p-1 text-white/60 hover:text-white rounded-full bg-white/5"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Grid of other nav items */}
              <div className="grid grid-cols-3 gap-y-6 gap-x-4 mb-8">
                {mobileMoreItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex flex-col items-center justify-center p-3 rounded-2xl transition-all border border-transparent',
                        active
                          ? 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/20'
                          : 'text-white/60 hover:bg-white/5 hover:text-white'
                      )}
                    >
                      <Icon size={22} className="mb-2" />
                      <span className="text-[11px] text-center font-medium line-clamp-1">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Super Admin Info + Buttons in Drawer */}
              <div className="mt-auto border-t border-white/10 pt-4 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-display font-bold flex items-center justify-center">
                    {name.charAt(0)}
                  </div>
                  <div className="truncate flex-1">
                    <p className="font-semibold text-white truncate text-sm">{name}</p>
                    <p className="text-white/50 text-xs truncate">{email}</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-2">
                  <Link
                    href="/"
                    className="flex-1 flex items-center justify-center gap-1.5 border border-white/20 text-white rounded-xl py-2.5 text-xs font-semibold"
                  >
                    <Globe size={14} /> Website
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-red-500 text-white rounded-xl py-2.5 text-xs font-semibold"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
