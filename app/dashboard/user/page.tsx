'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import RoomCard from '@/components/rooms/RoomCard';
import { FormField } from '@/components/ui/FormField';
import Loader from '@/components/ui/Loader';
import Skeleton from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';
import DashboardTopBar from '@/components/dashboard/DashboardTopBar';
import { Heart, User as UserIcon } from 'lucide-react';
import type { Room } from '@/types';

type Tab = 'saved' | 'profile';

export default function UserDashboardPage() {
  const { data: session, update } = useSession();
  const [tab, setTab] = useState<Tab>('saved');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [memberSince, setMemberSince] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#saved') {
      setTab('saved');
    }
  }, []);

  useEffect(() => {
    async function loadProfile() {
      const res = await fetch('/api/users/me');
      const json = await res.json();
      if (json.success && json.data) {
        setName(json.data.name ?? '');
        setPhone(json.data.phone ?? '');
        if (json.data.createdAt) {
          setMemberSince(
            new Date(json.data.createdAt).toLocaleDateString('en-IN', {
              month: 'long',
              year: 'numeric',
            })
          );
        }
      }
    }
    loadProfile();
  }, []);

  useEffect(() => {
    if (tab !== 'saved') return;
    async function loadSaved() {
      setLoading(true);
      try {
        const res = await fetch('/api/rooms/saved');
        const json = await res.json();
        if (json.success) setRooms(json.data ?? []);
      } finally {
        setLoading(false);
      }
    }
    loadSaved();
  }, [tab]);

  const handleUnsave = async (roomId: string) => {
    try {
      const res = await fetch(`/api/rooms/saved?roomId=${roomId}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setRooms((prev) => prev.filter((r) => r._id !== roomId));
        toast.success('Removed from saved');
      }
    } catch {
      toast.error('Failed to remove');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Profile updated!');
        await update({ name });
      }
    } catch {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  const initial = (name || session?.user?.name)?.charAt(0)?.toUpperCase() ?? 'U';

  const TABS: { id: Tab; label: string; Icon: typeof Heart }[] = [
    { id: 'saved', label: 'Saved Rooms', Icon: Heart },
    { id: 'profile', label: 'Profile', Icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-[#F9F6EF] dark:bg-[#0A0F0A] p-4 md:p-8 max-w-4xl mx-auto">
      <DashboardTopBar />
      <div className="flex gap-2 mb-8 lg:hidden w-full">
        {TABS.map((t) => {
          const TabIcon = t.Icon;
          return (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'flex-1 justify-center rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all',
              tab === t.id ? 'bg-[#16A34A] text-white' : 'bg-white dark:bg-[#111A11] text-gray-600 border border-gray-200 dark:border-[#1F2E1F]'
            )}
          >
            <TabIcon size={14} /> {t.label}
          </button>
        );
        })}
      </div>

      <div className="hidden lg:flex gap-4 mb-8 border-b border-gray-200 dark:border-[#1F2E1F]">
        {TABS.map((t) => {
          const TabIcon = t.Icon;
          return (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'pb-3 px-2 font-semibold text-sm border-b-2 -mb-px transition-default flex items-center gap-1',
              tab === t.id
                ? 'border-[#16A34A] text-[#16A34A]'
                : 'border-transparent text-gray-500'
            )}
          >
            <TabIcon size={14} /> {t.label}
          </button>
        );
        })}
      </div>

      {tab === 'saved' && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl text-[#0F2E1E] dark:text-white mb-6">
            Your Saved Rooms
          </h1>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-2xl" />
              ))}
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[#111A11] rounded-3xl border border-gray-100 dark:border-[#1F2E1F]">
              <Heart className="w-16 h-16 mx-auto mb-4 text-[#16A34A]/40" />
              <p className="font-semibold text-lg text-[#0F2E1E] dark:text-white">No saved rooms yet</p>
              <p className="text-gray-500 text-sm mt-2 mb-6">
                Browse rooms and tap the heart icon to save
              </p>
              <Link
                href="/search"
                className="inline-block bg-[#16A34A] text-white font-semibold rounded-xl px-6 py-3"
              >
                Search Rooms
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rooms.map((room, i) => (
                <RoomCard
                  key={room._id}
                  room={room}
                  index={i}
                  saved
                  onToggleSave={() => handleUnsave(room._id)}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}

      {tab === 'profile' && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg">
          <div className="bg-white dark:bg-[#111A11] rounded-3xl p-8 text-center border border-gray-100 dark:border-[#1F2E1F] mb-8">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#0F2E1E] text-[#D4AF37] font-display text-3xl flex items-center justify-center">
              {initial}
            </div>
            <p className="font-semibold text-xl mt-4 text-[#0F2E1E] dark:text-white">{name}</p>
            <p className="text-gray-500 text-sm">{phone}</p>
            <span className="inline-block mt-2 bg-[#F0FDF4] dark:bg-[#0F2E1E]/30 text-[#16A34A] text-xs font-semibold px-3 py-1 rounded-full">
              Room Seeker
            </span>
            {memberSince && (
              <p className="text-gray-400 text-xs mt-2">Member since {memberSince}</p>
            )}
          </div>

          <form onSubmit={handleSaveProfile}>
            <FormField label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <FormField label="Phone Number" value={phone} readOnly className="opacity-60" />
            <motion.button
              type="submit"
              disabled={saving}
              whileTap={{ scale: 0.96 }}
              className="w-full bg-[#16A34A] text-white rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 mb-6"
            >
              {saving ? <Loader size="sm" className="!w-5 !h-5 border-2 border-white border-t-transparent" /> : null}
              Save Changes
            </motion.button>
          </form>

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full border-2 border-red-200 text-red-500 font-semibold rounded-xl py-3.5 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Logout
          </button>
        </motion.div>
      )}
    </div>
  );
}
