'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getWhatsAppLink, timeAgo, formatPhoneDisplay } from '@/lib/utils';
import { cn } from '@/lib/utils';
import Skeleton from '@/components/ui/Skeleton';

interface InquiryItem {
  _id: string;
  name: string;
  phone: string;
  message?: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: string;
  room: { _id: string; title: string };
}

const FILTERS = ['all', 'new', 'contacted', 'closed'] as const;

export default function OwnerInquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const q = filter === 'all' ? '' : `&status=${filter}`;
        const res = await fetch(`/api/inquiries?owner=me${q}`);
        const json = await res.json();
        if (json.success) setInquiries(json.data ?? []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (json.success) {
        setInquiries((prev) =>
          prev.map((i) => (i._id === id ? { ...i, status: status as InquiryItem['status'] } : i))
        );
        toast.success('Status updated');
      }
    } catch {
      toast.error('Update failed');
    }
  };

  const borderColor: Record<string, string> = {
    new: 'border-[#16A34A]',
    contacted: 'border-[#D4AF37]',
    closed: 'border-gray-300 dark:border-gray-600',
  };

  return (
    <div>
      <h1 className="font-display text-2xl text-[#0F2E1E] dark:text-white mb-6">Inquiries</h1>

      <div className="flex gap-2 overflow-x-auto mb-6 scrollbar-hide hide-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
        {FILTERS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium capitalize whitespace-nowrap',
              filter === tab ? 'bg-[#16A34A] text-white' : 'bg-white dark:bg-[#111A11] border border-gray-200 dark:border-[#1F2E1F] text-gray-600'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <Skeleton className="h-32 rounded-2xl" />
      ) : inquiries.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No inquiries yet.</p>
      ) : (
        <div>
          {inquiries.map((inq) => (
            <div
              key={inq._id}
              className={cn(
                'bg-white dark:bg-[#111A11] rounded-2xl p-4 mb-3 border-l-4',
                borderColor[inq.status] ?? borderColor.new
              )}
            >
              <p className="font-semibold text-[#0F2E1E] dark:text-white">
                {inq.name} · {formatPhoneDisplay(inq.phone)}
              </p>
              <p className="text-sm text-[#16A34A] mt-1">Room: {inq.room?.title}</p>
              {inq.message && (
                <p className="text-sm text-gray-500 mt-2">{inq.message}</p>
              )}
              <p className="text-xs text-gray-400 mt-2">{timeAgo(inq.createdAt)}</p>

              <div className="flex flex-wrap gap-2 mt-4">
                <a
                  href={getWhatsAppLink(
                    inq.phone,
                    `Hi ${inq.name}, thanks for your interest in "${inq.room?.title}" on MeraRoom.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-[#25D366] text-white text-sm font-semibold rounded-xl px-4 py-2"
                >
                  Reply on WhatsApp
                </a>
                <select
                  value={inq.status}
                  onChange={(e) => updateStatus(inq._id, e.target.value)}
                  className="rounded-xl px-3 py-2 text-sm bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F]"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
