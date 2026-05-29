'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Megaphone,
  Upload,
  Trash2,
  Calendar,
  IndianRupee,
  Phone,
  Plus,
  X,
  Link as LinkIcon,
} from 'lucide-react';
import Loader from '@/components/ui/Loader';
import { cn } from '@/lib/utils';

interface AdSlot {
  slot: number;
  businessName: string;
  phone: string;
  startDate: string | null;
  endDate: string | null;
  amount: number;
  bannerImage: string;
  linkUrl?: string;
  isPaid: boolean;
  isActive: boolean;
}

const SLOT_DETAILS: Record<number, { name: string; size: string; desc: string }> = {
  1: {
    name: 'Homepage Top Leaderboard',
    size: '970 x 90 px',
    desc: 'Featured banner showing below the hero section of the homepage for maximum visibility.',
  },
  2: {
    name: 'Search Page Top Banner',
    size: '728 x 90 px',
    desc: 'Banner displaying at the top of room search query results, below filter chips.',
  },
  3: {
    name: 'Room Detail Bottom Banner',
    size: '728 x 90 px',
    desc: 'Horizontal banner displayed below stay amenities on single room detail pages.',
  },
};

export default function AdsPage() {
  const [slots, setSlots] = useState<AdSlot[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit / Add Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number>(1);
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [amount, setAmount] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [isPaid, setIsPaid] = useState(true);
  const [isActive, setIsActive] = useState(true);
  
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/ads');
      const json = await res.json();
      if (json.success) {
        setSlots(json.data ?? []);
      } else {
        toast.error('Failed to load advertisement slots');
      }
    } catch {
      toast.error('Failed to load advertisement slots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleOpenAddModal = (slot: AdSlot) => {
    setSelectedSlot(slot.slot);
    setBusinessName(slot.businessName || '');
    setPhone(slot.phone || '');
    setStartDate(slot.startDate ? slot.startDate.split('T')[0] : new Date().toISOString().split('T')[0]);
    
    const defaultEnd = new Date();
    defaultEnd.setDate(defaultEnd.getDate() + 30);
    setEndDate(slot.endDate ? slot.endDate.split('T')[0] : defaultEnd.toISOString().split('T')[0]);
    
    setAmount(slot.amount ? String(slot.amount) : '999');
    setBannerImage(slot.bannerImage || '');
    setLinkUrl(slot.linkUrl || '');
    setIsPaid(slot.isPaid);
    setIsActive(slot.isActive !== undefined ? slot.isActive : true);
    setIsModalOpen(true);
  };

  const handleOpenNewModal = () => {
    setSelectedSlot(1);
    setBusinessName('');
    setPhone('');
    setStartDate(new Date().toISOString().split('T')[0]);
    
    const defaultEnd = new Date();
    defaultEnd.setDate(defaultEnd.getDate() + 30);
    setEndDate(defaultEnd.toISOString().split('T')[0]);
    
    setAmount('999');
    setBannerImage('');
    setLinkUrl('');
    setIsPaid(true);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('folder', 'meraroom/ads');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      const url = json.url ?? json.data?.url;
      if (url) {
        setBannerImage(url);
        toast.success('Ad banner uploaded successfully');
      } else {
        toast.error('Failed to upload image');
      }
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleClearAd = async (slotNum: number) => {
    if (!window.confirm(`Are you sure you want to clear and delete Slot ${slotNum} ad?`)) return;
    try {
      const res = await fetch(`/api/admin/ads?slot=${slotNum}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Slot ${slotNum} cleared`);
        fetchAds();
      } else {
        toast.error(json.error ?? 'Failed to clear slot');
      }
    } catch {
      toast.error('Failed to clear slot');
    }
  };

  const handleSaveAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !phone.trim() || !bannerImage || !startDate || !endDate || !amount) {
      toast.error('Please fill in all fields and upload a banner image');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slot: selectedSlot,
          businessName,
          phone,
          startDate,
          endDate,
          amount: Number(amount),
          bannerImage,
          linkUrl,
          isPaid,
          isActive,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Advertisement slot configured live!');
        
        // Manual payment logging
        if (isPaid) {
          await fetch('/api/admin/payments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ownerName: businessName,
              phone: phone,
              service: `Ad Campaign (Slot ${selectedSlot})`,
              amount: Number(amount),
              paymentMethod: 'UPI',
              status: 'paid',
            }),
          });
        }

        setIsModalOpen(false);
        fetchAds();
      } else {
        toast.error(json.error ?? 'Failed to save ad details');
      }
    } catch {
      toast.error('Failed to save ad details');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-gray-200 dark:border-[#1F2E1F] pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-[#0F2E1E] dark:text-white flex items-center gap-2">
            <Megaphone className="text-[#D4AF37]" fill="currentColor" size={24} />
            Advertisement Banner Slots
          </h1>
          <p className="text-gray-500 text-xs mt-1">Configure external promotional banners displayed across user layout interfaces.</p>
        </div>
        <button
          onClick={handleOpenNewModal}
          className="bg-[#16A34A] hover:bg-[#16A34A]/90 text-white rounded-xl px-4 py-2.5 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-center shrink-0"
        >
          <Plus size={14} /> Add New Campaign
        </button>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center">
          <Loader size="lg" className="border-[#D4AF37] border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-6">
          {slots.map((slot) => {
            const details = SLOT_DETAILS[slot.slot] ?? { name: 'Ad Slot', size: 'N/A', desc: '' };
            const isCurrentlyActive = slot.bannerImage && slot.endDate && slot.isActive && (new Date(slot.endDate) >= new Date());
            
            return (
              <div
                key={slot.slot}
                className="bg-white dark:bg-[#111A11] rounded-2xl border border-gray-100 dark:border-[#1F2E1F] p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 relative overflow-hidden"
              >
                {/* Slot Details Header */}
                <div className="flex-1 space-y-4">
                  <div>
                    <span className="inline-block bg-[#0F2E1E]/10 dark:bg-white/10 text-xs font-semibold px-2.5 py-1 rounded-full mb-2">
                      Slot ID: {slot.slot} · size: {details.size}
                    </span>
                    <h3 className="font-display text-lg font-bold text-[#0F2E1E] dark:text-white">{details.name}</h3>
                    <p className="text-gray-500 text-xs mt-1 leading-relaxed">{details.desc}</p>
                  </div>

                  {slot.bannerImage ? (
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-t border-gray-100 dark:border-[#1F2E1F] pt-4 text-xs">
                      <div>
                        <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Business Name</p>
                        <p className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{slot.businessName}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Contact Info</p>
                        <p className="font-semibold text-[#16A34A] mt-0.5 flex items-center gap-1">
                          <Phone size={10} /> {slot.phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Active Duration</p>
                        <p className="text-gray-800 dark:text-gray-200 mt-0.5 flex items-center gap-1 font-mono text-[11px]">
                          <Calendar size={11} /> {slot.startDate ? new Date(slot.startDate).toLocaleDateString('en-IN') : ''} - {slot.endDate ? new Date(slot.endDate).toLocaleDateString('en-IN') : ''}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">UPI Cost</p>
                        <p className="font-bold text-[#D4AF37] mt-0.5 flex items-center gap-0.5">
                          <IndianRupee size={11} /> {slot.amount} ({slot.isPaid ? 'Paid' : 'Pending'})
                        </p>
                      </div>
                      {slot.linkUrl && (
                        <div className="col-span-2">
                          <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Redirect URL</p>
                          <a
                            href={slot.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-blue-500 hover:underline mt-0.5 flex items-center gap-1 break-all"
                          >
                            <LinkIcon size={10} /> {slot.linkUrl}
                          </a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-[#0F2E1E]/5 dark:bg-white/5 border border-dashed border-[#D4AF37]/35 rounded-xl p-4 text-center">
                      <p className="text-gray-400 text-xs font-medium">Slot is currently vacant. No active campaign.</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleOpenAddModal(slot)}
                      className="bg-[#16A34A] hover:bg-[#16A34A]/90 text-white rounded-xl px-4 py-2 text-xs font-semibold flex items-center gap-1 shrink-0"
                    >
                      <Plus size={14} /> {slot.bannerImage ? 'Edit Ad details' : 'Configure Banner Ad'}
                    </button>
                    {slot.bannerImage && (
                      <button
                        onClick={() => handleClearAd(slot.slot)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl px-4 py-2 text-xs font-semibold flex items-center gap-1 shrink-0"
                      >
                        <Trash2 size={14} /> Clear slot
                      </button>
                    )}
                  </div>
                </div>

                {/* Banner Image Preview Container */}
                <div className="w-full md:w-80 shrink-0 flex flex-col justify-center">
                  <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px] mb-2">Live Banner Preview</p>
                  {slot.bannerImage ? (
                    <div className="relative w-full h-36 bg-[#0F2E1E]/20 border border-gray-200 dark:border-[#1F2E1F] rounded-xl overflow-hidden shadow-sm group">
                      <Image src={slot.bannerImage} alt="" fill className="object-cover" unoptimized />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <span
                          className={`text-[9px] font-bold uppercase rounded-full px-2 py-0.5 text-white ${
                            isCurrentlyActive ? 'bg-green-600' : 'bg-red-500'
                          }`}
                        >
                          {isCurrentlyActive ? 'Active' : 'Expired'}
                        </span>
                        {!slot.isActive && (
                          <span className="text-[9px] font-bold uppercase rounded-full px-2 py-0.5 text-white bg-gray-500">
                            Disabled
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-36 bg-[#0F2E1E]/5 dark:bg-white/5 border border-dashed border-gray-200 dark:border-[#1F2E1F] rounded-xl flex flex-col items-center justify-center text-gray-400 gap-1 text-xs">
                      <Megaphone size={28} className="opacity-40 text-gray-300" />
                      <span>Vacant Preview</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit / Config Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white dark:bg-[#111A11] border border-gray-200 dark:border-[#1F2E1F] rounded-3xl p-6 max-w-md w-full shadow-2xl relative my-8"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full bg-gray-100 dark:bg-white/5 p-1 min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X size={16} />
              </button>

              <h3 className="font-display text-lg text-[#0F2E1E] dark:text-white mb-1">Configure Ad Campaign</h3>
              <p className="text-gray-500 text-xs mb-4">Set business details, active timeline, and upload banner file assets.</p>

              <form onSubmit={handleSaveAd} className="space-y-4 text-sm">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Business/Brand Name</label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Arnav Gym Dharamshala"
                    className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs text-[#1A1A1A] dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs text-[#1A1A1A] dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Ad Slot Target</label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(Number(e.target.value))}
                    className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs text-[#1A1A1A] dark:text-white focus:outline-none"
                  >
                    <option value={1}>Slot 1: Homepage Top Leaderboard</option>
                    <option value={2}>Slot 2: Search Page Top Banner</option>
                    <option value={3}>Slot 3: Room Detail Bottom Banner</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Redirect URL (Optional)</label>
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="e.g. https://katochfarm.com"
                    className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs text-[#1A1A1A] dark:text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Start Date</label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs focus:outline-none text-[#1A1A1A] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">End Date</label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs focus:outline-none text-[#1A1A1A] dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Price Paid (₹)</label>
                    <input
                      type="number"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="999"
                      className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs text-[#1A1A1A] dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Payment Status</label>
                    <div className="flex gap-1.5 mt-0.5">
                      <button
                        type="button"
                        onClick={() => setIsPaid(true)}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${
                          isPaid ? 'border-green-600 bg-green-500/10 text-green-600' : 'border-gray-200 dark:border-white/5 text-gray-400'
                        }`}
                      >
                        Paid
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsPaid(false)}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${
                          !isPaid ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-gray-200 dark:border-white/5 text-gray-400'
                        }`}
                      >
                        Pending
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1 border-t border-b border-gray-100 dark:border-[#1F2E1F]">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Campaign Active</span>
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className={cn(
                      'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                      isActive ? 'bg-[#16A34A]' : 'bg-gray-200 dark:bg-gray-800'
                    )}
                  >
                    <span
                      className={cn(
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        isActive ? 'translate-x-5' : 'translate-x-0'
                      )}
                    />
                  </button>
                </div>

                {/* Banner Upload File */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Banner Image URL or File</label>
                  {bannerImage ? (
                    <div className="relative w-full h-24 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 mb-2">
                      <Image src={bannerImage} alt="" fill className="object-cover" unoptimized />
                      <button
                        type="button"
                        onClick={() => setBannerImage('')}
                        className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full p-1 shadow-sm shrink-0"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="border border-dashed border-gray-300 dark:border-white/10 rounded-xl p-5 text-center bg-gray-50 dark:bg-[#0A0F0A] relative hover:bg-gray-100 dark:hover:bg-[#0F2E1E]/10 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        disabled={uploading}
                      />
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-1" />
                      {uploading ? (
                        <p className="text-xs text-gray-400">Uploading banner image...</p>
                      ) : (
                        <div>
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Click to upload banner file</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Supports PNG, JPG (Max 5MB)</p>
                        </div>
                      )}
                    </div>
                  )}
                  <input
                    type="text"
                    value={bannerImage}
                    onChange={(e) => setBannerImage(e.target.value)}
                    placeholder="Or paste external banner image URL..."
                    className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs text-[#1A1A1A] dark:text-white focus:outline-none mt-2"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 border border-gray-300 dark:border-[#1F2E1F] text-gray-600 dark:text-gray-300 rounded-xl py-3 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-[#D4AF37] text-[#0F2E1E] rounded-xl py-3 text-xs font-semibold hover:brightness-110 flex items-center justify-center gap-1.5"
                  >
                    {submitting && <Loader size="sm" className="border-[#0F2E1E] border-t-transparent" />}
                    Save Campaign
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
