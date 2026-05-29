'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Search,
  MessageCircle,
  Phone,
  Calendar,
  CheckCircle,
  Clock,
  Archive,
  ChevronDown,
  X,
  FileText,
} from 'lucide-react';
import { cn, timeAgo, formatPhoneDisplay } from '@/lib/utils';
import Loader from '@/components/ui/Loader';
import { CONTACT_SUBJECTS } from '@/constants';

interface ContactMessage {
  _id: string;
  name: string;
  phone: string;
  subject: string;
  message?: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  createdAt: string;
}

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contacts');
      const json = await res.json();
      if (json.success) {
        let list: ContactMessage[] = json.data ?? [];
        
        // Filter by status tab
        if (statusFilter !== 'all') {
          list = list.filter((m) => m.status === statusFilter);
        }

        // Filter by search query
        if (search.trim()) {
          const q = search.toLowerCase();
          list = list.filter(
            (m) =>
              m.name.toLowerCase().includes(q) ||
              m.phone.includes(q) ||
              m.subject.toLowerCase().includes(q) ||
              (m.message && m.message.toLowerCase().includes(q))
          );
        }
        setMessages(list);
      } else {
        toast.error('Failed to load contact messages');
      }
    } catch {
      toast.error('Failed to load contact messages');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleStatusChange = async (id: string, newStatus: ContactMessage['status']) => {
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Message status updated to ${newStatus}`);
        setMessages((prev) =>
          prev.map((msg) => (msg._id === id ? { ...msg, status: newStatus } : msg))
        );
        setStatusDropdownOpen(null);
      } else {
        toast.error(json.error ?? 'Failed to update status');
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const getSubjectLabel = (value: string) => {
    const found = CONTACT_SUBJECTS.find((s) => s.value === value);
    return found ? found.label : value;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#1F2E1F] pb-6">
        <div>
          <h1 className="font-display text-2xl text-[#0F2E1E] dark:text-white">Contact Messages</h1>
          <p className="text-gray-500 text-xs mt-1">General enquiries submitted from the contact form.</p>
        </div>
        <span className="bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold rounded-full px-2.5 py-1 shrink-0">
          {messages.length} Messages
        </span>
      </div>

      {/* Search & Tabs */}
      <div className="bg-white dark:bg-[#111A11] rounded-2xl p-4 border border-gray-100 dark:border-[#1F2E1F] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="relative flex-1 max-w-md w-full">
          <Search size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone or content..."
            className="w-full rounded-xl pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-sm text-[#1A1A1A] dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
          {['all', 'new', 'replied', 'closed'].map((tab) => (
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
      ) : messages.length === 0 ? (
        <div className="bg-white dark:bg-[#111A11] rounded-2xl py-20 text-center border border-gray-100 dark:border-[#1F2E1F] shadow-sm">
          <Archive className="w-14 h-14 mx-auto text-gray-300 mb-4" />
          <h3 className="font-semibold text-lg text-[#0F2E1E] dark:text-white">No messages</h3>
          <p className="text-gray-500 text-sm mt-1">There are no messages matching your query.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {messages.map((msg) => {
              const cleanedPhone = msg.phone.replace(/\D/g, '');
              const cleanDigits = cleanedPhone.startsWith('91') && cleanedPhone.length > 10 ? cleanedPhone.slice(2) : cleanedPhone;
              const waHref = `https://wa.me/91${cleanDigits}`;
              const isNew = msg.status === 'new';

              return (
                <motion.div
                  key={msg._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={cn(
                    'bg-white dark:bg-[#111A11] rounded-2xl p-4 border border-gray-100 dark:border-[#1F2E1F] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4',
                    isNew ? 'border-l-4 border-[#16A34A]' : 'border-l-4 border-gray-300 dark:border-l-gray-700'
                  )}
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-[#0F2E1E] dark:text-white text-sm sm:text-base">
                        {msg.name}
                      </p>
                      <span className="text-gray-400 text-xs font-mono">• {formatPhoneDisplay(msg.phone)}</span>
                      <span className="text-gray-400 text-xs">• {timeAgo(msg.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase">
                        <FileText size={10} />
                        {getSubjectLabel(msg.subject)}
                      </span>
                    </div>

                    {msg.message ? (
                      <p className="bg-gray-50 dark:bg-[#0A0F0A] rounded-xl p-3 text-xs leading-relaxed text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-[#1F2E1F] whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400 italic">No message body provided.</p>
                    )}
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap border-t sm:border-t-0 border-gray-100 dark:border-[#1F2E1F] pt-3 sm:pt-0">
                    <div className="relative">
                      <button
                        onClick={() => setStatusDropdownOpen(statusDropdownOpen === msg._id ? null : msg._id)}
                        className={cn(
                          'text-xs font-bold px-2.5 py-1.5 rounded-full capitalize inline-flex items-center gap-1 border border-transparent hover:border-gray-200 dark:hover:border-white/10 shrink-0',
                          msg.status === 'new' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
                          msg.status === 'read' && 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-400',
                          msg.status === 'replied' && 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
                          msg.status === 'closed' && 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                        )}
                      >
                        <span>{msg.status}</span>
                        <ChevronDown size={12} />
                      </button>

                      {statusDropdownOpen === msg._id && (
                        <div className="absolute right-0 mt-1 bg-white dark:bg-[#111A11] border border-gray-200 dark:border-[#1F2E1F] rounded-xl shadow-xl py-1 z-20 min-w-[110px]">
                          {['new', 'read', 'replied', 'closed'].map((status) => (
                            <button
                              key={status}
                              onClick={() => handleStatusChange(msg._id, status as any)}
                              className="w-full text-left px-3 py-1.5 text-xs font-semibold capitalize hover:bg-gray-50 dark:hover:bg-[#0F2E1E]/30 text-gray-700 dark:text-gray-300"
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {msg.status !== 'replied' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(msg._id, 'replied')}
                        className="border border-[#16A34A] hover:bg-[#16A34A]/10 text-[#16A34A] rounded-xl px-3 py-2 text-xs font-semibold shrink-0"
                      >
                        Mark Replied
                      </button>
                    )}

                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#25D366] hover:bg-[#25D366]/90 text-white rounded-xl px-4 py-2.5 text-xs font-semibold flex items-center gap-1.5 min-h-[38px] shrink-0"
                    >
                      <MessageCircle size={14} /> WhatsApp Reply
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
