'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Shield,
  Search,
  Calendar,
  Trash2,
  Plus,
  X,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { formatRent } from '@/lib/utils';
import Loader from '@/components/ui/Loader';

interface Room {
  _id: string;
  title: string;
  area: string;
  rent: number;
  isVerified: boolean;
  verifiedAt?: string;
  images: string[];
  owner: {
    name: string;
    phone: string;
  };
}

export default function VerifiedPage() {
  const [verifiedRooms, setVerifiedRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // Search/Add new verified stays
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Room[]>([]);
  const [searching, setSearching] = useState(false);

  // Modal / Selection to Verify
  const [selectedRoomToVerify, setSelectedRoomToVerify] = useState<Room | null>(null);
  const [verifyDate, setVerifyDate] = useState('');
  const [submittingVerify, setSubmittingVerify] = useState(false);

  const fetchVerifiedRooms = async () => {
    setLoading(true);
    try {
      // Query parameters for the endpoint: owner=all, status=all to fetch from all owners
      const res = await fetch('/api/rooms?owner=all&status=all');
      const json = await res.json();
      if (json.success) {
        // Since api/rooms route doesn't filter by isVerified natively in GET (yet),
        // we can filter the list in client side or we will update GET rooms route later.
        // Let's filter on client side for safety, and also support GET params if available.
        const verified = (json.data ?? []).filter((r: any) => r.isVerified);
        setVerifiedRooms(verified);
      } else {
        toast.error('Failed to load verified rooms');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load verified rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifiedRooms();
    setVerifyDate(new Date().toISOString().split('T')[0]);
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
        // filter out already verified rooms
        const unverified = (json.data ?? []).filter((r: Room) => !r.isVerified);
        setSearchResults(unverified);
        if (unverified.length === 0) {
          toast.error('No matching properties found (or already verified)');
        }
      }
    } catch {
      toast.error('Error searching rooms');
    } finally {
      setSearching(false);
    }
  };

  const handleRemoveVerification = async (id: string) => {
    if (!window.confirm('Remove verification from this room?')) return;
    try {
      const res = await fetch(`/api/rooms/${id}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: false }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Property verification badge removed.');
        setVerifiedRooms((prev) => prev.filter((r) => r._id !== id));
      } else {
        toast.error(json.error ?? 'Failed to remove verification');
      }
    } catch {
      toast.error('Failed to remove verification');
    }
  };

  const handleAddVerifyClick = (room: Room) => {
    setSelectedRoomToVerify(room);
    setVerifyDate(new Date().toISOString().split('T')[0]);
  };

  const submitVerify = async () => {
    if (!selectedRoomToVerify) return;
    setSubmittingVerify(true);
    const id = selectedRoomToVerify._id;

    try {
      const res = await fetch(`/api/rooms/${id}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: true, verifiedAt: new Date(verifyDate).toISOString() }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Room marked as Verified stay!');
        
        // Create manual payment log if admin wants to charge for verification (optional)
        // For verified badge, it can be a one-time charge, let's log a pending or paid entry
        await fetch('/api/admin/payments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ownerName: selectedRoomToVerify.owner?.name ?? 'Property Owner',
            phone: selectedRoomToVerify.owner?.phone ?? '9876543210',
            service: 'verified',
            amount: 199, // default verification price
            paymentMethod: 'GPay',
            status: 'paid',
          }),
        });

        setSelectedRoomToVerify(null);
        setSearchQuery('');
        setSearchResults([]);
        fetchVerifiedRooms();
      } else {
        toast.error(json.error ?? 'Failed to verify listing');
      }
    } catch {
      toast.error('Failed to verify listing');
    } finally {
      setSubmittingVerify(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-[#1F2E1F] pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-[#0F2E1E] dark:text-white flex items-center gap-2">
            <Shield className="text-teal-600 dark:text-teal-400" fill="currentColor" size={24} />
            Verified Badges
          </h1>
          <p className="text-gray-500 text-xs mt-1">Verified properties display a trust shield badge, increasing credibility and room seeker interest.</p>
        </div>
        <span className="bg-teal-500/20 text-teal-700 dark:text-teal-400 text-xs font-bold rounded-full px-2.5 py-1 shrink-0 self-start sm:self-center border border-teal-500/35">
          {verifiedRooms.length} Verified Stays
        </span>
      </div>

      {/* Verify a stay room search form */}
      <div className="bg-white dark:bg-[#111A11] rounded-2xl p-5 border border-gray-100 dark:border-[#1F2E1F] shadow-sm space-y-4">
        <h3 className="font-semibold text-sm text-[#0F2E1E] dark:text-white">Verify a Stay Room</h3>
        <form onSubmit={handleSearchRooms} className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rooms to verify (e.g. by title, landmark)..."
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
                  onClick={() => handleAddVerifyClick(room)}
                  className="bg-teal-600 hover:bg-teal-500 text-white rounded-lg px-2.5 py-1 text-[11px] font-bold inline-flex items-center gap-1 shrink-0"
                >
                  <Plus size={12} /> Verify Stay
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Verified Stays Grid */}
      {loading ? (
        <div className="min-h-[30vh] flex flex-col items-center justify-center">
          <Loader size="lg" className="border-teal-500 border-t-transparent" />
        </div>
      ) : verifiedRooms.length === 0 ? (
        <div className="bg-white dark:bg-[#111A11] rounded-2xl py-16 text-center border border-gray-100 dark:border-[#1F2E1F] shadow-sm">
          <Shield className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-semibold text-sm">No verified properties currently.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {verifiedRooms.map((room) => (
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
                <span className="absolute top-2 left-2 bg-teal-600 text-white text-[10px] font-bold rounded-full px-2 py-0.5 flex items-center gap-0.5 shadow-md">
                  <Shield size={10} fill="currentColor" /> Verified
                </span>
                <button
                  onClick={() => handleRemoveVerification(room._id)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shrink-0"
                  title="Remove Verification"
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
                  {/* Verification date */}
                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span className="flex items-center gap-1"><Calendar size={11} /> Verified On:</span>
                    <span className="font-semibold text-teal-600 dark:text-teal-400">
                      {room.verifiedAt
                        ? new Date(room.verifiedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Today'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-400">Owner:</span>
                    <span className="text-[#0F2E1E] dark:text-gray-300 font-semibold">{room.owner?.name ?? 'Admin'}</span>
                  </div>
                </div>

                <div className="pt-1">
                  <Link
                    href={`/rooms/${room._id}`}
                    target="_blank"
                    className="w-full flex items-center justify-center gap-1 bg-[#0F2E1E]/5 hover:bg-[#0F2E1E]/10 dark:bg-white/5 dark:hover:bg-white/10 text-xs py-2 rounded-xl text-gray-700 dark:text-gray-300 border border-transparent dark:border-white/5"
                  >
                    <ExternalLink size={12} /> View Listing
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Verify stay configuration modal */}
      <AnimatePresence>
        {selectedRoomToVerify && (
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
                onClick={() => setSelectedRoomToVerify(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full bg-gray-100 dark:bg-white/5 p-1 min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X size={16} />
              </button>

              <h3 className="font-display text-lg text-[#0F2E1E] dark:text-white mb-2">Verify Property</h3>
              <p className="text-gray-500 text-xs mb-4">Confirm verification details for &quot;{selectedRoomToVerify.title}&quot;.</p>

              <div className="space-y-4 text-sm mb-6">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Verification Date</label>
                  <input
                    type="date"
                    value={verifyDate}
                    onChange={(e) => setVerifyDate(e.target.value)}
                    className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs focus:border-[#16A34A] focus:outline-none"
                  />
                </div>

                <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl flex items-start gap-2.5 text-teal-800 dark:text-teal-400 text-xs">
                  <Shield className="shrink-0 mt-0.5 text-teal-600" size={16} />
                  <div>
                    <p className="font-semibold">Trust Verification Badge</p>
                    <p className="opacity-95 mt-0.5">This listing will have a verified shield overlay across the site, and the owner will be charged ₹199 (logged as manual payment).</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedRoomToVerify(null)}
                  className="flex-1 border border-gray-300 dark:border-[#1F2E1F] text-gray-600 dark:text-gray-300 rounded-xl py-2.5 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={submitVerify}
                  disabled={submittingVerify}
                  className="flex-1 bg-teal-600 text-white rounded-xl py-2.5 text-xs font-semibold hover:bg-teal-500 flex items-center justify-center gap-1 min-h-[38px]"
                >
                  {submittingVerify && <Loader size="sm" className="border-white border-t-transparent" />}
                  Confirm Verify
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
