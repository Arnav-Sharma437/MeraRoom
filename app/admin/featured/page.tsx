'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Star,
  Search,
  Calendar,
  Trash2,
  AlertCircle,
  Clock,
  CheckCircle,
  Plus,
  X,
  IndianRupee,
} from 'lucide-react';
import { cn, formatRent } from '@/lib/utils';
import Loader from '@/components/ui/Loader';

interface Room {
  _id: string;
  title: string;
  area: string;
  rent: number;
  isFeatured: boolean;
  featuredUntil?: string;
  images: string[];
  owner: {
    name: string;
    phone: string;
  };
}

export default function FeaturedPage() {
  const [featuredRooms, setFeaturedRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // Search/Add new featured stays
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Room[]>([]);
  const [searching, setSearching] = useState(false);

  // Modal / Selection to Feature
  const [selectedRoomToFeature, setSelectedRoomToFeature] = useState<Room | null>(null);
  const [featureDate, setFeatureDate] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending'>('paid');
  const [submittingFeature, setSubmittingFeature] = useState(false);

  const fetchFeaturedRooms = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/rooms?isFeatured=true&owner=all&status=all');
      const json = await res.json();
      if (json.success) {
        setFeaturedRooms(json.data ?? []);
      } else {
        toast.error('Failed to load featured rooms');
      }
    } catch {
      toast.error('Failed to load featured rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedRooms();
    
    // Set default date to 30 days from now
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    setFeatureDate(defaultDate.toISOString().split('T')[0]);
  }, []);

  const handleSearchRooms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const res = await fetch(`/api/rooms?q=${searchQuery}&owner=all&status=all`);
      const json = await res.json();
      if (json.success) {
        // filter out already featured rooms
        const unfeatured = (json.data ?? []).filter((r: Room) => !r.isFeatured);
        setSearchResults(unfeatured);
        if (unfeatured.length === 0) {
          toast.error('No matching properties found (or already featured)');
        }
      }
    } catch {
      toast.error('Error searching rooms');
    } finally {
      setSearching(false);
    }
  };

  const handleRemoveFeatured = async (id: string) => {
    if (!window.confirm('Remove this room from featured?')) return;
    try {
      const res = await fetch(`/api/rooms/${id}/feature`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: false }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Listing removed from featured.');
        setFeaturedRooms((prev) => prev.filter((r) => r._id !== id));
      }
    } catch {
      toast.error('Failed to remove featured');
    }
  };

  const handleAddFeaturedClick = (room: Room) => {
    setSelectedRoomToFeature(room);
    setPaymentStatus('paid');
  };

  const submitFeature = async () => {
    if (!selectedRoomToFeature) return;
    setSubmittingFeature(true);
    const id = selectedRoomToFeature._id;
    const featuredUntil = new Date(featureDate);

    try {
      const res = await fetch(`/api/rooms/${id}/feature`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: true, featuredUntil: featuredUntil.toISOString() }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Room marked as featured!');
        
        // Optionally create manual payment log
        if (paymentStatus === 'paid') {
          await fetch('/api/admin/payments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ownerName: selectedRoomToFeature.owner?.name ?? 'Property Owner',
              phone: selectedRoomToFeature.owner?.phone ?? '9876543210',
              service: 'featured',
              amount: 399, // default featured price
              paymentMethod: 'PhonePe',
              status: 'paid',
            }),
          });
        }

        setSelectedRoomToFeature(null);
        setSearchQuery('');
        setSearchResults([]);
        fetchFeaturedRooms();
      } else {
        toast.error(json.error ?? 'Failed to feature listing');
      }
    } catch {
      toast.error('Failed to feature listing');
    } finally {
      setSubmittingFeature(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-[#1F2E1F] pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-[#0F2E1E] dark:text-white flex items-center gap-2">
            <Star className="text-[#D4AF37]" fill="currentColor" size={24} />
            Featured Listings
          </h1>
          <p className="text-gray-500 text-xs mt-1">Properties marked featured appear on the homepage and at the top of search queries.</p>
        </div>
        <span className="bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold rounded-full px-2.5 py-1 shrink-0 self-start sm:self-center border border-[#D4AF37]/35">
          {featuredRooms.length} Featured Stays
        </span>
      </div>

      {/* Add new Featured Stay Form Search */}
      <div className="bg-white dark:bg-[#111A11] rounded-2xl p-5 border border-gray-100 dark:border-[#1F2E1F] shadow-sm space-y-4">
        <h3 className="font-semibold text-sm text-[#0F2E1E] dark:text-white">Feature a Stay Room</h3>
        <form onSubmit={handleSearchRooms} className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rooms to feature (e.g. by title, landmark)..."
              className="w-full rounded-xl pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs text-[#1A1A1A] dark:text-white focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-[#16A34A] hover:bg-[#16A34A]/90 text-white rounded-xl px-4 py-2 text-xs font-semibold shrink-0 min-h-[36px]"
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Search Results list */}
        {searchResults.length > 0 && (
          <div className="border border-gray-100 dark:border-[#1F2E1F] rounded-xl overflow-hidden divide-y divide-gray-100 dark:divide-[#1F2E1F]">
            {searchResults.map((room) => (
              <div key={room._id} className="p-3 flex items-center justify-between gap-4 bg-gray-50/50 dark:bg-[#0F2E1E]/5 hover:bg-gray-100/50 dark:hover:bg-[#0F2E1E]/10">
                <div className="min-w-0">
                  <p className="font-semibold text-xs text-brand-black dark:text-white truncate">{room.title}</p>
                  <p className="text-[10px] text-gray-500 truncate">{room.area} · {formatRent(room.rent)}/mo · Owner: {room.owner?.name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddFeaturedClick(room)}
                  className="bg-[#D4AF37] hover:brightness-110 text-[#0F2E1E] rounded-lg px-2.5 py-1 text-[11px] font-bold inline-flex items-center gap-1 shrink-0"
                >
                  <Plus size={12} /> Feature Stays
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Featured Stays Grid */}
      {loading ? (
        <div className="min-h-[30vh] flex flex-col items-center justify-center">
          <Loader size="lg" className="border-[#D4AF37] border-t-transparent" />
        </div>
      ) : featuredRooms.length === 0 ? (
        <div className="bg-white dark:bg-[#111A11] rounded-2xl py-16 text-center border border-gray-100 dark:border-[#1F2E1F] shadow-sm">
          <Star className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-semibold text-sm">No featured listings currently.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredRooms.map((room) => {
            const hasExpired = room.featuredUntil ? new Date(room.featuredUntil) < new Date() : false;
            return (
              <div
                key={room._id}
                className="bg-white dark:bg-[#111A11] rounded-2xl border border-gray-100 dark:border-[#1F2E1F] overflow-hidden shadow-sm relative group flex flex-col justify-between"
              >
                <div className="relative h-40 bg-[#0F2E1E] shrink-0">
                  {room.images?.[0] ? (
                    <Image src={room.images[0]} alt="" fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/20 text-xs">NO IMAGE</div>
                  )}
                  <span className="absolute top-2 left-2 bg-[#D4AF37] text-[#0F2E1E] text-[10px] font-bold rounded-full px-2 py-0.5 flex items-center gap-0.5">
                    <Star size={10} fill="currentColor" /> Featured
                  </span>
                  <button
                    onClick={() => handleRemoveFeatured(room._id)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shrink-0"
                    title="Remove Featured"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm text-[#0F2E1E] dark:text-white line-clamp-1">{room.title}</h4>
                    <p className="text-xs text-gray-500">{room.area} · {formatRent(room.rent)}/mo</p>
                  </div>

                  <div className="border-t border-gray-100 dark:border-[#1F2E1F] pt-2 space-y-2">
                    {/* Expiration date */}
                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                      <span className="flex items-center gap-1"><Clock size={11} /> Expiry:</span>
                      <span className={cn('font-semibold', hasExpired ? 'text-red-500' : 'text-amber-500')}>
                        {room.featuredUntil
                          ? new Date(room.featuredUntil).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Never'}
                      </span>
                    </div>

                    {/* Payment Badge Status */}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-400 flex items-center gap-1"><IndianRupee size={11} /> Payment:</span>
                      <span className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded px-1.5 py-0.5 font-bold">
                        Paid - ₹399
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Feature Stay Config Confirmation Modal */}
      <AnimatePresence>
        {selectedRoomToFeature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white dark:bg-[#111A11] border border-gray-200 dark:border-[#1F2E1F] rounded-3xl p-6 max-w-sm w-full shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedRoomToFeature(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full bg-gray-100 dark:bg-white/5 p-1 min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X size={16} />
              </button>

              <h3 className="font-display text-lg text-[#0F2E1E] dark:text-white mb-2">Configure Featured Stay</h3>
              <p className="text-gray-500 text-xs mb-4">Set featured duration and payment details for &quot;{selectedRoomToFeature.title}&quot;.</p>

              <div className="space-y-4 text-sm mb-6">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Featured Until</label>
                  <input
                    type="date"
                    value={featureDate}
                    onChange={(e) => setFeatureDate(e.target.value)}
                    className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs focus:border-[#16A34A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Manual payment Status</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentStatus('paid')}
                      className={cn(
                        'flex-1 py-2 rounded-xl text-xs font-semibold border transition-all',
                        paymentStatus === 'paid'
                          ? 'border-[#16A34A] bg-[#F0FDF4] text-[#16A34A]'
                          : 'border-gray-200 dark:border-[#1F2E1F]'
                      )}
                    >
                      Paid (₹399 UPI)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentStatus('pending')}
                      className={cn(
                        'flex-1 py-2 rounded-xl text-xs font-semibold border transition-all',
                        paymentStatus === 'pending'
                          ? 'border-amber-500 bg-amber-50 text-amber-500 dark:bg-amber-900/10'
                          : 'border-gray-200 dark:border-[#1F2E1F]'
                      )}
                    >
                      Pending Payment
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedRoomToFeature(null)}
                  className="flex-1 border border-gray-300 dark:border-[#1F2E1F] text-gray-600 dark:text-gray-300 rounded-xl py-2.5 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={submitFeature}
                  disabled={submittingFeature}
                  className="flex-1 bg-[#D4AF37] text-[#0F2E1E] rounded-xl py-2.5 text-xs font-semibold hover:brightness-110 flex items-center justify-center gap-1 min-h-[38px]"
                >
                  {submittingFeature && <Loader size="sm" className="border-[#0F2E1E] border-t-transparent" />}
                  Confirm Feature
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
