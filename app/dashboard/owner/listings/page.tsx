'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { MoreVertical, Trash2, Eye } from 'lucide-react';
import { formatRent } from '@/lib/utils';
import { cn } from '@/lib/utils';
import Skeleton from '@/components/ui/Skeleton';
import type { Room } from '@/types';

const STATUS_TABS = ['all', 'approved', 'pending', 'rejected'] as const;

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };
  return (
    <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full capitalize', styles[status] ?? styles.pending)}>
      {status}
    </span>
  );
}

export default function OwnerListingsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/rooms?owner=me&limit=50&status=${statusFilter}`);
      const json = await res.json();
      if (json.success) setRooms(json.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [statusFilter]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/rooms/${deleteId}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        toast.success('Room deleted!');
        setRooms((prev) => prev.filter((r) => r._id !== deleteId));
        setDeleteId(null);
      } else {
        toast.error(json.error ?? 'Delete failed');
      }
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-2xl text-[#0F2E1E] dark:text-white">
          My Listings ({rooms.length})
        </h1>
        <Link
          href="/dashboard/owner/post"
          className="inline-flex justify-center bg-[#16A34A] text-white font-semibold rounded-xl px-5 py-2.5 text-sm hover:bg-[#D4AF37] hover:text-[#0F2E1E] transition-default"
        >
          + Add New Room
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto mb-6">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setStatusFilter(tab)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap capitalize transition-default',
              statusFilter === tab
                ? 'bg-[#16A34A] text-white'
                : 'bg-white dark:bg-[#111A11] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#1F2E1F]'
            )}
          >
            {tab === 'all' ? 'All' : tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : rooms.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No listings yet. Post your first room!</p>
      ) : (
        <div className="space-y-4">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="bg-white dark:bg-[#111A11] rounded-2xl p-4 border border-gray-100 dark:border-[#1F2E1F] flex gap-4"
            >
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#0F2E1E] shrink-0">
                {room.images?.[0] ? (
                  <Image src={room.images[0]} alt="" fill className="object-cover" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-2xl">🏠</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <div>
                    <p className="font-semibold text-[#0F2E1E] dark:text-white truncate">{room.title}</p>
                    <p className="text-sm text-gray-500">{room.area}</p>
                  </div>
                  <StatusBadge status={room.status} />
                </div>
                <p className="text-[#16A34A] font-semibold mt-1">{formatRent(room.rent)}/mo</p>
                <p className="text-xs text-gray-400 mt-1">
                  {room.views ?? 0} views
                </p>
              </div>
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setMenuOpen(menuOpen === room._id ? null : room._id)}
                  className="p-2 text-gray-500"
                  aria-label="Actions"
                >
                  <MoreVertical size={20} />
                </button>
                {menuOpen === room._id && (
                  <div className="absolute right-0 top-10 bg-white dark:bg-[#111A11] rounded-xl shadow-lg border border-gray-100 dark:border-[#1F2E1F] py-1 z-10 min-w-[120px]">
                    <Link
                      href={`/rooms/${room._id}`}
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-[#0F2E1E]/30"
                    >
                      <Eye size={16} /> View
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteId(room._id);
                        setMenuOpen(null);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
            onClick={() => !deleting && setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#111A11] rounded-2xl p-6 max-w-sm w-full"
            >
              <h3 className="font-display text-xl text-[#0F2E1E] dark:text-white mb-2">
                Delete listing?
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Are you sure you want to delete this listing? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setDeleteId(null)}
                  className="flex-1 border border-gray-300 dark:border-[#1F2E1F] rounded-xl py-2.5 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleDelete}
                  className="flex-1 bg-red-500 text-white rounded-xl py-2.5 text-sm font-semibold disabled:opacity-70"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
