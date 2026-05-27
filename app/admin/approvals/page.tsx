'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  MessageCircle,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Calendar,
  User as UserIcon,
  Phone,
  X,
} from 'lucide-react';
import { formatRent, getWhatsAppLink, timeAgo } from '@/lib/utils';
import Loader from '@/components/ui/Loader';
import { POST_AMENITIES } from '@/constants';
import { LucideByName } from '@/components/ui/LucideByName';

interface Room {
  _id: string;
  title: string;
  description: string;
  rent: number;
  deposit: number;
  area: string;
  address: string;
  whatsappNumber: string;
  roomType: string;
  furnishing: string;
  gender: string;
  amenities: Record<string, boolean>;
  allowedFor: Record<string, boolean>;
  images: string[];
  status: string;
  createdAt: string;
  owner: {
    name: string;
    phone: string;
  };
}

export default function ApprovalsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchPendingRooms = async () => {
    try {
      const res = await fetch('/api/rooms?status=pending&owner=all');
      const json = await res.json();
      if (json.success) {
        setRooms(json.data ?? []);
      } else {
        toast.error('Failed to load pending approvals');
      }
    } catch {
      toast.error('Failed to load pending approvals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRooms();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/rooms/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Listing approved and live!');
        setRooms((prev) => prev.filter((r) => r._id !== id));
      } else {
        toast.error(json.error ?? 'Approval failed');
      }
    } catch {
      toast.error('Approval failed');
    }
  };

  const handleRejectClick = (id: string) => {
    setActionId(id);
    setRejectionReason('');
    setRejectionModalOpen(true);
  };

  const submitRejection = async () => {
    if (!actionId) return;
    try {
      const res = await fetch(`/api/rooms/${actionId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', reason: rejectionReason }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Listing rejected.');
        setRooms((prev) => prev.filter((r) => r._id !== actionId));
        setRejectionModalOpen(false);
        setActionId(null);
      } else {
        toast.error(json.error ?? 'Rejection failed');
      }
    } catch {
      toast.error('Rejection failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader size="lg" className="border-brand-green border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 dark:border-[#1F2E1F] pb-6">
        <h1 className="font-display text-2xl text-[#0F2E1E] dark:text-white">Pending Approvals</h1>
        <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-full px-2.5 py-1">
          {rooms.length} Pending
        </span>
      </div>

      {rooms.length === 0 ? (
        <div className="bg-white dark:bg-[#111A11] rounded-2xl py-20 text-center border border-gray-100 dark:border-[#1F2E1F] shadow-sm">
          <CheckCircle className="w-14 h-14 mx-auto text-green-500 mb-4" />
          <h3 className="font-semibold text-lg text-[#0F2E1E] dark:text-white">All Caught Up!</h3>
          <p className="text-gray-500 text-sm mt-1">There are no pending rooms awaiting approval.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {rooms.map((room) => {
              const whatsappMsg = `Hi ${room.owner?.name || 'Owner'}, regarding your room submission "${room.title}" on MeraRoom.`;
              const whatsappHref = getWhatsAppLink(room.whatsappNumber, whatsappMsg);
              const activeAmenities = Object.entries(room.amenities)
                .filter(([, v]) => v)
                .map(([k]) => POST_AMENITIES.find((a) => a.key === k))
                .filter(Boolean);

              return (
                <motion.div
                  key={room._id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-[#111A11] rounded-2xl p-5 border-l-4 border-amber-400 border border-gray-100 dark:border-[#1F2E1F] shadow-sm flex flex-col md:flex-row gap-5"
                >
                  {/* Left image */}
                  <div className="relative w-full md:w-36 h-28 rounded-xl overflow-hidden shrink-0 bg-[#0F2E1E]">
                    {room.images?.[0] ? (
                      <Image src={room.images[0]} alt="" fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white/20 text-[10px] font-bold">
                        NO IMAGE
                      </div>
                    )}
                  </div>

                  {/* Right Content */}
                  <div className="flex-1 flex flex-col justify-between min-w-0 space-y-4">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-semibold text-base text-[#0F2E1E] dark:text-white truncate" title={room.title}>
                          {room.title}
                        </h3>
                        <span className="text-gray-400 text-xs font-mono whitespace-nowrap">
                          {timeAgo(room.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                        <MapPin size={12} className="text-[#16A34A] shrink-0" />
                        {room.area} · {room.address}
                      </p>
                      <p className="font-semibold text-[#16A34A] text-sm mt-1">{formatRent(room.rent)}/mo</p>
                    </div>

                    {/* Owner Info row */}
                    <div className="flex items-center justify-between flex-wrap gap-2 bg-gray-50 dark:bg-[#0A0F0A] rounded-xl p-3 text-xs border border-gray-100 dark:border-[#1F2E1F]">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#0F2E1E] text-[#D4AF37] font-bold flex items-center justify-center">
                          {room.owner?.name?.charAt(0) ?? 'O'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700 dark:text-gray-300">{room.owner?.name ?? 'Admin'}</p>
                          <p className="text-gray-400">{room.owner?.phone}</p>
                        </div>
                      </div>
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#25D366] text-white rounded-lg px-3 py-1.5 font-semibold flex items-center gap-1"
                      >
                        <MessageCircle size={14} /> WhatsApp Owner
                      </a>
                    </div>

                    {/* Amenities chips */}
                    {activeAmenities.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {activeAmenities.slice(0, 5).map((a: any) => (
                          <span
                            key={a.key}
                            className="bg-gray-100 dark:bg-[#0A0F0A] text-gray-600 dark:text-gray-400 text-[10px] rounded-full px-2 py-0.5 flex items-center gap-1"
                          >
                            <LucideByName name={a.icon} size={10} />
                            {a.label}
                          </span>
                        ))}
                        {activeAmenities.length > 5 && (
                          <span className="text-[10px] text-gray-400">+{activeAmenities.length - 5} more</span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 border-t border-gray-100 dark:border-[#1F2E1F] pt-3 flex-wrap">
                      <button
                        onClick={() => setSelectedRoom(room)}
                        className="bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-white text-xs font-semibold rounded-xl px-4 py-2 flex items-center gap-1.5 min-h-[38px]"
                      >
                        <Eye size={14} /> View Details
                      </button>
                      <button
                        onClick={() => handleApprove(room._id)}
                        className="bg-[#16A34A] hover:bg-[#16A34A]/90 text-white text-xs font-semibold rounded-xl px-5 py-2 flex items-center gap-1.5 min-h-[38px] ml-auto"
                      >
                        <CheckCircle size={14} /> Approve Stay
                      </button>
                      <button
                        onClick={() => handleRejectClick(room._id)}
                        className="bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-500 border border-red-200 dark:border-red-900/30 text-xs font-semibold rounded-xl px-5 py-2 flex items-center gap-1.5 min-h-[38px]"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Details View Modal */}
      <AnimatePresence>
        {selectedRoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#111A11] border border-gray-200 dark:border-[#1F2E1F] rounded-3xl p-6 max-w-xl w-full shadow-2xl relative max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedRoom(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full bg-gray-100 dark:bg-white/5 p-1 min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X size={20} />
              </button>

              <h3 className="font-display text-xl text-[#0F2E1E] dark:text-white mb-2">{selectedRoom.title}</h3>
              <p className="text-[#16A34A] font-semibold text-sm mb-4">{formatRent(selectedRoom.rent)}/month (Deposit: {formatRent(selectedRoom.deposit)})</p>

              {selectedRoom.images?.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {selectedRoom.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <Image src={img} alt="" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-1">Local Address</h4>
                  <p>{selectedRoom.area} · {selectedRoom.address}</p>
                </div>

                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-1">Description</h4>
                  <p className="whitespace-pre-line text-xs leading-relaxed">{selectedRoom.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-[#1F2E1F] pt-3">
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-1">Furnishing</h4>
                    <p className="capitalize">{selectedRoom.furnishing}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-1">Allowed For</h4>
                    <p className="capitalize">
                      {Object.entries(selectedRoom.allowedFor)
                        .filter(([, v]) => v)
                        .map(([k]) => k)
                        .join(', ') || 'All'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-[#1F2E1F]">
                <button
                  onClick={() => {
                    const id = selectedRoom._id;
                    setSelectedRoom(null);
                    handleApprove(id);
                  }}
                  className="flex-1 bg-[#16A34A] text-white rounded-xl py-2.5 text-xs font-semibold"
                >
                  Approve Stay
                </button>
                <button
                  onClick={() => {
                    const id = selectedRoom._id;
                    setSelectedRoom(null);
                    handleRejectClick(id);
                  }}
                  className="flex-1 bg-red-50 text-red-500 border border-red-200 rounded-xl py-2.5 text-xs font-semibold"
                >
                  Reject
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rejection Reason Modal */}
      <AnimatePresence>
        {rejectionModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white dark:bg-[#111A11] border border-gray-200 dark:border-[#1F2E1F] rounded-3xl p-6 max-w-md w-full shadow-2xl"
            >
              <h3 className="font-display text-xl text-[#0F2E1E] dark:text-white mb-2">Rejection Reason</h3>
              <p className="text-gray-500 text-sm mb-4">Provide a reason for rejection (optional) which will be displayed to the listing owner.</p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Please upload higher quality photos of the kitchen..."
                rows={4}
                className="w-full rounded-2xl px-4 py-3 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-sm focus:border-red-500 focus:outline-none resize-none mb-6"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setRejectionReason('');
                    submitRejection();
                  }}
                  className="flex-1 border border-gray-200 dark:border-[#1F2E1F] text-gray-600 dark:text-gray-300 rounded-xl py-3 text-sm font-semibold"
                >
                  Skip Reason
                </button>
                <button
                  onClick={submitRejection}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white rounded-xl py-3 text-sm font-semibold"
                >
                  Send Rejection
                </button>
              </div>
              <button
                onClick={() => setRejectionModalOpen(false)}
                className="w-full text-center mt-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs font-semibold py-2"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
