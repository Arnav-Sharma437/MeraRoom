'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Home, CheckCircle, MessageCircle, Eye, Plus, List } from 'lucide-react';
import { fadeInUp, staggerContainer, viewportOnce } from '@/lib/animations';
import { getGreeting, getWhatsAppLink, timeAgo, formatPhoneDisplay } from '@/lib/utils';
import Skeleton from '@/components/ui/Skeleton';
import type { Room } from '@/types';

interface InquiryRow {
  _id: string;
  name: string;
  phone: string;
  message?: string;
  createdAt: string;
  status: string;
  room: { title: string; _id: string };
}

export default function OwnerOverviewPage() {
  const { data: session } = useSession();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [inquiries, setInquiries] = useState<InquiryRow[]>([]);
  const [inquiryCount, setInquiryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [roomsRes, inqRes] = await Promise.all([
          fetch('/api/rooms?owner=me&limit=50&status=all'),
          fetch('/api/inquiries?owner=me'),
        ]);
        const roomsJson = await roomsRes.json();
        const inqJson = await inqRes.json();
        if (roomsJson.success) setRooms(roomsJson.data ?? []);
        if (inqJson.success) {
          const all = inqJson.data ?? [];
          setInquiries(all.slice(0, 3));
          setInquiryCount(all.length);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalListings = rooms.length;
  const activeListings = rooms.filter((r) => r.status === 'approved').length;
  const totalInquiries = inquiryCount;
  const totalViews = rooms.reduce((sum, r) => sum + (r.views ?? 0), 0);
  const name = session?.user?.name?.split(' ')[0] ?? 'there';

  const stats = [
    { label: 'Total Listings', value: totalListings, icon: Home, className: 'bg-[#0F2E1E] text-[#D4AF37]' },
    { label: 'Active Listings', value: activeListings, icon: CheckCircle, className: 'bg-[#16A34A] text-white' },
    { label: 'Recent Inquiries', value: totalInquiries, icon: MessageCircle, className: 'bg-white dark:bg-[#111A11] text-[#0F2E1E] dark:text-white' },
    { label: 'Total Views', value: totalViews, icon: Eye, className: 'bg-white dark:bg-[#111A11] text-[#0F2E1E] dark:text-white' },
  ];

  return (
    <motion.div variants={staggerContainer(0.08)} initial="hidden" animate="visible">
      <motion.h1 variants={fadeInUp} className="font-display text-2xl text-[#0F2E1E] dark:text-white mb-6">
        {getGreeting()}, {name}!
      </motion.h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))
          : stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={fadeInUp}
                  className={cnCard(stat.className)}
                >
                  <Icon size={22} className="opacity-80 mb-2" />
                  <p className="font-display text-3xl">{stat.value}</p>
                  <p className="text-sm opacity-70 mt-1">{stat.label}</p>
                </motion.div>
              );
            })}
      </div>

      <motion.section variants={fadeInUp} viewport={viewportOnce} className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg text-[#0F2E1E] dark:text-white">Recent Inquiries</h2>
          <Link href="/dashboard/owner/inquiries" className="text-[#16A34A] text-sm font-medium">
            View All →
          </Link>
        </div>
        {loading ? (
          <Skeleton className="h-32 rounded-2xl" />
        ) : inquiries.length === 0 ? (
          <p className="text-gray-500 text-sm">No inquiries yet.</p>
        ) : (
          <div className="space-y-3">
            {inquiries.map((inq) => (
              <div
                key={inq._id}
                className="bg-white dark:bg-[#111A11] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-gray-100 dark:border-[#1F2E1F]"
              >
                <div>
                  <p className="font-semibold text-[#0F2E1E] dark:text-white">
                    {inq.name} · {formatPhoneDisplay(inq.phone)}
                  </p>
                  <p className="text-sm text-gray-500">{inq.room?.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{timeAgo(inq.createdAt)}</p>
                </div>
                <a
                  href={getWhatsAppLink(
                    inq.phone,
                    `Hi ${inq.name}, regarding your inquiry for "${inq.room?.title}" on MeraRoom.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center bg-[#25D366] text-white text-sm font-semibold rounded-xl px-4 py-2 min-h-[40px] items-center"
                >
                  WhatsApp
                </a>
              </div>
            ))}
          </div>
        )}
      </motion.section>

      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/dashboard/owner/post"
          className="flex-1 text-center bg-[#16A34A] text-white font-semibold rounded-xl py-3.5 hover:bg-[#D4AF37] hover:text-[#0F2E1E] transition-default"
        >
          <Plus size={16} className="inline mr-1" />
          Post New Room
        </Link>
        <Link
          href="/dashboard/owner/listings"
          className="flex-1 text-center border-2 border-[#0F2E1E] dark:border-[#D4AF37] text-[#0F2E1E] dark:text-[#D4AF37] font-semibold rounded-xl py-3.5 transition-default inline-flex items-center justify-center gap-1"
        >
          <List size={16} />
          View My Listings
        </Link>
      </motion.div>
    </motion.div>
  );
}

function cnCard(className: string) {
  return `rounded-2xl p-5 shadow-sm ${className}`;
}
