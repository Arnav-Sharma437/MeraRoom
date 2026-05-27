'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Search,
  MessageCircle,
  Phone,
  Calendar,
  Home,
  CheckCircle,
  Clock,
  Archive,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { cn, getWhatsAppLink, timeAgo, formatPhoneDisplay } from '@/lib/utils';
import Loader from '@/components/ui/Loader';

interface Inquiry {
  _id: string;
  name: string;
  phone: string;
  message?: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: string;
  room: {
    _id: string;
    title: string;
    area: string;
    rent: number;
    whatsappNumber: string;
  };
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<string | null>(null);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      
      const res = await fetch(`/api/inquiries?${params}`);
      const json = await res.json();
      if (json.success) {
        let list: Inquiry[] = json.data ?? [];
        // client-side search by name, phone or room title
        if (search.trim()) {
          const q = search.toLowerCase();
          list = list.filter(
            (inq) =>
              inq.name.toLowerCase().includes(q) ||
              inq.phone.includes(q) ||
              inq.room?.title.toLowerCase().includes(q)
          );
        }
        setInquiries(list);
      } else {
        toast.error('Failed to load inquiries');
      }
    } catch {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleStatusChange = async (id: string, newStatus: 'new' | 'contacted' | 'closed') => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Inquiry status updated to ${newStatus}`);
        setInquiries((prev) =>
          prev.map((inq) => (inq._id === id ? { ...inq, status: newStatus } : inq))
        );
        setStatusDropdownOpen(null);
      } else {
        toast.error(json.error ?? 'Failed to update status');
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#1F2E1F] pb-6">
        <div>
          <h1 className="font-display text-2xl text-[#0F2E1E] dark:text-white">Customer Inquiries</h1>
          <p className="text-gray-500 text-xs mt-1">All user inquiries submitted on room listings.</p>
        </div>
        <span className="bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold rounded-full px-2.5 py-1 shrink-0">
          {inquiries.length} Inquiries
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#111A11] rounded-2xl p-4 border border-gray-100 dark:border-[#1F2E1F] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="relative flex-1 max-w-md w-full">
          <Search size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by inquirer name, phone or room title..."
            className="w-full rounded-xl pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-sm text-[#1A1A1A] dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          {['all', 'new', 'contacted', 'closed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={cn(
                'rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-all whitespace-nowrap min-h-[36px]',
                statusFilter === tab
                  ? 'bg-[#16A34A] text-white'
                  : 'bg-gray-100 dark:bg-[#0A0F0A] text-gray-600 dark:text-gray-400'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center">
          <Loader size="lg" className="border-brand-green border-t-transparent" />
        </div>
      ) : inquiries.length === 0 ? (
        <div className="bg-white dark:bg-[#111A11] rounded-2xl py-20 text-center border border-gray-100 dark:border-[#1F2E1F] shadow-sm">
          <Archive className="w-14 h-14 mx-auto text-gray-300 mb-4" />
          <h3 className="font-semibold text-lg text-[#0F2E1E] dark:text-white">No inquiries</h3>
          <p className="text-gray-500 text-sm mt-1">There are no inquiries matching your query.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {inquiries.map((inq) => {
              const whatsappMsg = `Hi ${inq.name}, I am Arnav from MeraRoom regarding your inquiry for the stay "${inq.room?.title || 'Room'}"...`;
              const whatsappHref = getWhatsAppLink(inq.phone, whatsappMsg);

              return (
                <motion.div
                  key={inq._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white dark:bg-[#111A11] rounded-2xl p-4 border border-gray-100 dark:border-[#1F2E1F] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-[#0F2E1E] dark:text-white text-sm sm:text-base">
                        {inq.name}
                      </p>
                      <span className="text-gray-400 text-xs font-mono">• {formatPhoneDisplay(inq.phone)}</span>
                      <span className="text-gray-400 text-xs">• {timeAgo(inq.createdAt)}</span>
                    </div>

                    {inq.room && (
                      <p className="text-xs text-[#16A34A] font-semibold flex items-center gap-1">
                        <Home size={12} className="shrink-0" />
                        Room Listing:{' '}
                        <Link
                          href={`/rooms/${inq.room._id}`}
                          target="_blank"
                          className="hover:underline flex items-center gap-0.5"
                        >
                          {inq.room.title} <ExternalLink size={10} />
                        </Link>
                      </p>
                    )}

                    {inq.message ? (
                      <p className="bg-gray-50 dark:bg-[#0A0F0A] rounded-xl p-3 text-xs leading-relaxed text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-[#1F2E1F]">
                        {inq.message}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400 italic">No custom message provided.</p>
                    )}
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap border-t sm:border-t-0 border-gray-100 dark:border-[#1F2E1F] pt-3 sm:pt-0">
                    {/* Status Select Toggle */}
                    <div className="relative">
                      <button
                        onClick={() => setStatusDropdownOpen(statusDropdownOpen === inq._id ? null : inq._id)}
                        className={cn(
                          'text-xs font-bold px-2.5 py-1.5 rounded-full capitalize inline-flex items-center gap-1 border border-transparent hover:border-gray-200 dark:hover:border-white/10 shrink-0',
                          inq.status === 'new' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
                          inq.status === 'contacted' && 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
                          inq.status === 'closed' && 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-400'
                        )}
                      >
                        <span>{inq.status}</span>
                        <ChevronDown size={12} />
                      </button>
                      {statusDropdownOpen === inq._id && (
                        <div className="absolute right-0 mt-1 bg-white dark:bg-[#111A11] border border-gray-200 dark:border-[#1F2E1F] rounded-xl shadow-xl py-1 z-20 min-w-[110px]">
                          {['new', 'contacted', 'closed'].map((status) => (
                            <button
                              key={status}
                              onClick={() => handleStatusChange(inq._id, status as any)}
                              className="w-full text-left px-3 py-1.5 text-xs font-semibold capitalize hover:bg-gray-50 dark:hover:bg-[#0F2E1E]/30 text-gray-700 dark:text-gray-300"
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#25D366] hover:bg-[#25D366]/90 text-white rounded-xl px-4 py-2.5 text-xs font-semibold flex items-center gap-1.5 min-h-[38px] shrink-0"
                    >
                      <MessageCircle size={14} /> WhatsApp
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
