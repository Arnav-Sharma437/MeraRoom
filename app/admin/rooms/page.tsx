'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Search,
  Filter,
  Plus,
  Star,
  Shield,
  Eye,
  Trash2,
  Edit,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  X,
  Upload,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { cn, formatRent, normalizePhone } from '@/lib/utils';
import Loader from '@/components/ui/Loader';
import { DHARAMSHALA_AREAS, POST_ROOM_TYPES, POST_FURNISHING, POST_AMENITIES, GENDER_OPTIONS, DEFAULT_AMENITIES } from '@/constants';
import type { RoomType, Furnishing, GenderPreference, IRoomAmenities, IRoomAllowedFor } from '@/models/Room';
import { useLocations } from '@/hooks/useLocations';

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
  amenities: IRoomAmenities;
  allowedFor: IRoomAllowedFor;
  images: string[];
  status: 'pending' | 'approved' | 'rejected';
  isFeatured: boolean;
  featuredUntil?: string;
  isVerified: boolean;
  verifiedAt?: string;
  views: number;
  createdAt: string;
  owner: {
    _id: string;
    name: string;
    phone: string;
  };
}

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  
  const { locations } = useLocations();
  
  // Search & Filter
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Modals & Actions
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [rowMenuOpen, setRowMenuOpen] = useState<string | null>(null);
  
  // Room Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formRent, setFormRent] = useState('');
  const [formDeposit, setFormDeposit] = useState('');
  const [formArea, setFormArea] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customArea, setCustomArea] = useState('');

  const handleAreaSelect = (value: string) => {
    if (value === 'custom') {
      setShowCustomInput(true);
      setFormArea(customArea);
    } else {
      setShowCustomInput(false);
      setFormArea(value);
    }
  };

  const handleCustomAreaChange = (value: string) => {
    setCustomArea(value);
    setFormArea(value);
  };

  useEffect(() => {
    if (formArea && locations.length > 0) {
      const isPredefined = locations.some((a) => a.name === formArea);
      if (!isPredefined) {
        setShowCustomInput(true);
        setCustomArea(formArea);
      } else {
        setShowCustomInput(false);
      }
    }
  }, [locations, formArea]);
  const [formAddress, setFormAddress] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formType, setFormType] = useState<RoomType>('single');
  const [formFurnishing, setFormFurnishing] = useState<Furnishing>('furnished');
  const [formGender, setFormGender] = useState<GenderPreference>('any');
  const [formAmenities, setFormAmenities] = useState<IRoomAmenities>({
    wifi: false, ac: false, parking: false, parkingTwoWheeler: false, parkingFourWheeler: false, attachedBath: false, kitchen: false,
    laundry: false, tv: false, powerBackup: false, security: false, gym: false
  });
  const [formAllowedFor, setFormAllowedFor] = useState<IRoomAllowedFor>({
    students: false, working: false, family: false, bachelors: false
  });
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formStatus, setFormStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formVerified, setFormVerified] = useState(false);
  const [formFeaturedUntil, setFormFeaturedUntil] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Status dropdown mapping in the rows
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        status: statusFilter,
        q: search,
        owner: 'all', // Admin mode fetches all
      });
      const res = await fetch(`/api/rooms?${params}`);
      const json = await res.json();
      if (json.success) {
        setRooms(json.data ?? []);
        setTotal(json.total ?? 0);
      } else {
        toast.error('Failed to load rooms');
      }
    } catch {
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search, limit]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Handle Search Debounce / Trigger
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchRooms();
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === rooms.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(rooms.map((r) => r._id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    } else {
      setSelectedIds((prev) => [...prev, id]);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/rooms/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Room status updated to ${newStatus}`);
        setRooms((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
        );
        setStatusDropdownOpen(null);
      } else {
        toast.error(json.error ?? 'Failed to update status');
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleFeaturedToggle = async (id: string, currentFeatured: boolean) => {
    const nextFeatured = !currentFeatured;
    const defaultUntil = new Date();
    defaultUntil.setDate(defaultUntil.getDate() + 30); // 30 days default featured expiration

    try {
      const res = await fetch(`/api/rooms/${id}/feature`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isFeatured: nextFeatured,
          featuredUntil: nextFeatured ? defaultUntil.toISOString() : null,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(nextFeatured ? 'Room added to Featured Listings' : 'Room removed from Featured');
        setRooms((prev) =>
          prev.map((r) => (r._id === id ? { ...r, isFeatured: nextFeatured } : r))
        );
      }
    } catch {
      toast.error('Failed to toggle featured state');
    }
  };

  const handleVerifiedToggle = async (id: string, currentVerified: boolean) => {
    const nextVerified = !currentVerified;

    try {
      const res = await fetch(`/api/rooms/${id}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: nextVerified }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(nextVerified ? 'Property marked as Verified' : 'Property verification removed');
        setRooms((prev) =>
          prev.map((r) => (r._id === id ? { ...r, isVerified: nextVerified } : r))
        );
      }
    } catch {
      toast.error('Failed to toggle verification state');
    }
  };

  const handleOpenAddModal = () => {
    setSelectedRoom(null);
    setFormTitle('');
    setFormDesc('');
    setFormRent('');
    setFormDeposit('');
    setFormArea(locations.length > 0 ? locations[0].name : DHARAMSHALA_AREAS[0].name);
    setFormAddress('');
    setFormPhone('');
    setFormType('single');
    setFormFurnishing('furnished');
    setFormGender('any');
    setFormAmenities({
      wifi: false, ac: false, parking: false, parkingTwoWheeler: false, parkingFourWheeler: false, attachedBath: false, kitchen: false,
      laundry: false, tv: false, powerBackup: false, security: false, gym: false
    });
    setFormAllowedFor({
      students: false, working: false, family: false, bachelors: false
    });
    setFormImages([]);
    setFormStatus('pending');
    setFormFeatured(false);
    setFormVerified(false);
    setFormFeaturedUntil('');
    setEditModalOpen(true);
  };

  const handleOpenEditModal = (room: Room) => {
    setSelectedRoom(room);
    setFormTitle(room.title);
    setFormDesc(room.description);
    setFormRent(String(room.rent));
    setFormDeposit(String(room.deposit));
    setFormArea(room.area);
    setFormAddress(room.address);
    setFormPhone(room.whatsappNumber);
    setFormType(room.roomType as RoomType);
    setFormFurnishing(room.furnishing as Furnishing);
    setFormGender(room.gender as GenderPreference);
    setFormAmenities({ ...room.amenities });
    setFormAllowedFor({ ...room.allowedFor });
    setFormImages([...(room.images ?? [])]);
    setFormStatus(room.status);
    setFormFeatured(room.isFeatured);
    setFormVerified(room.isVerified);
    setFormFeaturedUntil(room.featuredUntil ? room.featuredUntil.split('T')[0] : '');
    setEditModalOpen(true);
    setRowMenuOpen(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      const url = json.url ?? json.data?.url;
      if (url) {
        setFormImages((prev) => [...prev, url]);
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Image upload failed');
      }
    } catch {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDesc.trim() || !formRent || !formArea || !formAddress.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (showCustomInput && formArea.trim().length < 2) {
      toast.error('Area name must be at least 2 characters');
      return;
    }

    setSaving(true);
    const payload = {
      title: formTitle,
      description: formDesc,
      rent: Number(formRent),
      deposit: Number(formDeposit) || 0,
      area: formArea,
      address: formAddress,
      whatsappNumber: normalizePhone(formPhone),
      roomType: formType,
      furnishing: formFurnishing,
      gender: formGender,
      amenities: {
        ...formAmenities,
        parking: formAmenities.parkingTwoWheeler || formAmenities.parkingFourWheeler,
      },
      allowedFor: formAllowedFor,
      images: formImages,
      status: formStatus,
    };

    try {
      let res;
      if (selectedRoom) {
        res = await fetch(`/api/rooms/${selectedRoom._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/rooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const json = await res.json();
      if (json.success) {
        toast.success(selectedRoom ? 'Room updated' : 'Room added');
        
        // Also save featured/verified if changed
        if (selectedRoom) {
          const id = selectedRoom._id;
          if (formFeatured !== selectedRoom.isFeatured || formFeaturedUntil !== (selectedRoom.featuredUntil ? selectedRoom.featuredUntil.split('T')[0] : '')) {
            await fetch(`/api/rooms/${id}/feature`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                isFeatured: formFeatured,
                featuredUntil: formFeatured && formFeaturedUntil ? new Date(formFeaturedUntil).toISOString() : null,
              }),
            });
          }
          if (formVerified !== selectedRoom.isVerified) {
            await fetch(`/api/rooms/${id}/verify`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ isVerified: formVerified }),
            });
          }
        }
        
        setEditModalOpen(false);
        fetchRooms();
      } else {
        toast.error(json.error ?? 'Save failed');
      }
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDeleteConfirm = (room: Room) => {
    setSelectedRoom(room);
    setDeleteModalOpen(true);
    setRowMenuOpen(null);
  };

  const handleDeleteRoom = async () => {
    if (!selectedRoom) return;
    try {
      const res = await fetch(`/api/rooms/${selectedRoom._id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        toast.success('Property deleted successfully');
        setRooms((prev) => prev.filter((r) => r._id !== selectedRoom._id));
        setDeleteModalOpen(false);
        setSelectedRoom(null);
      } else {
        toast.error(json.error ?? 'Deletion failed');
      }
    } catch {
      toast.error('Deletion failed');
    }
  };

  // Bulk Actions
  const handleBulkApprove = async () => {
    const promises = selectedIds.map((id) =>
      fetch(`/api/rooms/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      })
    );
    try {
      await Promise.all(promises);
      toast.success('Selected properties approved!');
      setSelectedIds([]);
      fetchRooms();
    } catch {
      toast.error('Bulk approval failed');
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} properties?`)) return;
    const promises = selectedIds.map((id) =>
      fetch(`/api/rooms/${id}`, { method: 'DELETE' })
    );
    try {
      await Promise.all(promises);
      toast.success('Selected properties deleted successfully');
      setSelectedIds([]);
      fetchRooms();
    } catch {
      toast.error('Bulk deletion failed');
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl text-[#0F2E1E] dark:text-white">All Stays</h1>
          <span className="bg-[#0F2E1E]/10 dark:bg-white/10 text-[#0F2E1E] dark:text-white text-xs font-bold rounded-full px-2.5 py-1">
            {total} Rooms
          </span>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-1.5 bg-[#16A34A] hover:bg-[#16A34A]/90 text-white rounded-xl px-5 py-3 text-sm font-semibold transition-all min-h-[44px]"
        >
          <Plus size={16} /> Add Room
        </button>
      </div>

      {/* Filters Header bar */}
      <div className="bg-white dark:bg-[#111A11] rounded-2xl p-4 border border-gray-100 dark:border-[#1F2E1F] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md w-full">
          <Search size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, owner name..."
            className="w-full rounded-xl pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-sm text-[#1A1A1A] dark:text-white focus:outline-none"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2">
          {['all', 'approved', 'pending', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setPage(1);
              }}
              className={cn(
                'rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-all whitespace-nowrap min-h-[36px]',
                statusFilter === status
                  ? 'bg-[#16A34A] text-white'
                  : 'bg-gray-100 dark:bg-[#0A0F0A] text-gray-600 dark:text-gray-400 border border-transparent hover:border-gray-200 dark:hover:border-white/10'
              )}
            >
              {status === 'all' ? 'All' : status === 'approved' ? 'Live' : status === 'pending' ? 'Pending' : 'Rejected'}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions Header */}
      {selectedIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#111A11] rounded-xl p-3 border-l-4 border-[#D4AF37] flex items-center justify-between gap-4 shadow-sm"
        >
          <span className="text-sm font-semibold text-[#0F2E1E] dark:text-white">
            {selectedIds.length} properties selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleBulkApprove}
              className="bg-green-500 hover:bg-green-600 text-white rounded-xl px-4 py-2 text-xs font-semibold"
            >
              Approve All
            </button>
            <button
              onClick={handleBulkDelete}
              className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-4 py-2 text-xs font-semibold"
            >
              Delete All
            </button>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center">
          <Loader size="lg" className="border-brand-green border-t-transparent" />
        </div>
      ) : rooms.length === 0 ? (
        <div className="bg-white dark:bg-[#111A11] rounded-2xl py-16 text-center border border-gray-100 dark:border-[#1F2E1F]">
          <Eye className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <p className="font-semibold text-gray-500">No rooms listed matches this status.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table view */}
          <div className="hidden md:block bg-white dark:bg-[#111A11] rounded-2xl border border-gray-100 dark:border-[#1F2E1F] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-[#1F2E1F] text-gray-400 text-xs font-semibold uppercase bg-gray-50 dark:bg-[#0F2E1E]/5">
                    <th className="p-4 w-10">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === rooms.length}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-[#16A34A] focus:ring-[#16A34A]"
                      />
                    </th>
                    <th className="py-4">Stay</th>
                    <th className="py-4">Area</th>
                    <th className="py-4">Rent</th>
                    <th className="py-4">Owner</th>
                    <th className="py-4">Status</th>
                    <th className="py-4 text-center">Featured</th>
                    <th className="py-4 text-center">Verified</th>
                    <th className="py-4 text-center">Views</th>
                    <th className="py-4 text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#1F2E1F]">
                  {rooms.map((room) => (
                    <tr key={room._id} className="hover:bg-gray-50/50 dark:hover:bg-[#0F2E1E]/10 transition-colors">
                      <td className="p-4 w-10">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(room._id)}
                          onChange={() => toggleSelectRow(room._id)}
                          className="rounded border-gray-300 text-[#16A34A] focus:ring-[#16A34A]"
                        />
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-[#0F2E1E]">
                            {room.images?.[0] ? (
                              <Image src={room.images[0]} alt="" fill className="object-cover" />
                            ) : (
                              <span className="absolute inset-0 flex items-center justify-center text-[#D4AF37]/50 text-xs font-bold">
                                {room.roomType.toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="max-w-[180px]">
                            <p className="font-semibold text-[#0F2E1E] dark:text-white truncate" title={room.title}>
                              {room.title}
                            </p>
                            <p className="text-gray-400 text-xs mt-0.5 capitalize">{room.roomType}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-gray-500 dark:text-gray-400 font-medium">{room.area}</td>
                      <td className="py-4 font-semibold text-gray-800 dark:text-gray-200">{formatRent(room.rent)}</td>
                      <td className="py-4">
                        <div className="text-xs">
                          <p className="font-medium text-gray-700 dark:text-gray-300 truncate max-w-[110px]">{room.owner?.name ?? 'Super Admin'}</p>
                          <p className="text-gray-400 mt-0.5">{room.owner?.phone ?? '9876543210'}</p>
                        </div>
                      </td>
                      <td className="py-4 relative">
                        {/* Status dropdown */}
                        <button
                          onClick={() => setStatusDropdownOpen(statusDropdownOpen === room._id ? null : room._id)}
                          className={cn(
                            'text-xs font-semibold px-2.5 py-1 rounded-full capitalize inline-flex items-center gap-1 cursor-pointer border border-transparent hover:border-gray-300',
                            room.status === 'approved' && 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
                            room.status === 'pending' && 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
                            room.status === 'rejected' && 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                          )}
                        >
                          {room.status}
                        </button>
                        {statusDropdownOpen === room._id && (
                          <div className="absolute left-0 mt-1 bg-white dark:bg-[#111A11] border border-gray-200 dark:border-[#1F2E1F] rounded-xl shadow-xl py-1 z-20 min-w-[110px]">
                            {['pending', 'approved', 'rejected'].map((s) => (
                              <button
                                key={s}
                                onClick={() => handleStatusChange(room._id, s as any)}
                                className="w-full text-left px-3 py-1.5 text-xs font-medium capitalize hover:bg-gray-50 dark:hover:bg-[#0F2E1E]/30 text-gray-700 dark:text-gray-300"
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-4 text-center">
                        <button
                          onClick={() => handleFeaturedToggle(room._id, room.isFeatured)}
                          className={cn(
                            'p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#0F2E1E]/50',
                            room.isFeatured ? 'text-[#D4AF37]' : 'text-gray-300'
                          )}
                        >
                          <Star size={18} fill={room.isFeatured ? 'currentColor' : 'none'} />
                        </button>
                      </td>
                      <td className="py-4 text-center">
                        <button
                          onClick={() => handleVerifiedToggle(room._id, room.isVerified)}
                          className={cn(
                            'p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#0F2E1E]/50',
                            room.isVerified ? 'text-teal-600 dark:text-teal-400' : 'text-gray-300'
                          )}
                        >
                          <Shield size={18} fill={room.isVerified ? 'currentColor' : 'none'} />
                        </button>
                      </td>
                      <td className="py-4 text-center text-gray-400 font-mono text-xs">{room.views ?? 0}</td>
                      <td className="py-4 text-right pr-4 relative">
                        <button
                          onClick={() => setRowMenuOpen(rowMenuOpen === room._id ? null : room._id)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg"
                        >
                          <MoreVertical size={18} />
                        </button>
                        {rowMenuOpen === room._id && (
                          <div className="absolute right-4 mt-1 bg-white dark:bg-[#111A11] border border-gray-200 dark:border-[#1F2E1F] rounded-xl shadow-xl py-1 z-20 min-w-[130px]">
                            <Link
                              href={`/rooms/${room._id}`}
                              target="_blank"
                              className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-[#0F2E1E]/30 text-gray-700 dark:text-gray-300"
                            >
                              <ExternalLink size={14} /> View on Site
                            </Link>
                            <button
                              onClick={() => handleOpenEditModal(room)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-[#0F2E1E]/30 text-left text-gray-700 dark:text-gray-300"
                            >
                              <Edit size={14} /> Edit Listing
                            </button>
                            <button
                              onClick={() => handleOpenDeleteConfirm(room)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-left font-semibold"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {rooms.map((room) => (
              <div key={room._id} className="bg-white dark:bg-[#111A11] rounded-2xl p-4 border border-gray-100 dark:border-[#1F2E1F] shadow-sm space-y-3">
                <div className="flex gap-3">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-[#0F2E1E]">
                    {room.images?.[0] ? (
                      <Image src={room.images[0]} alt="" fill className="object-cover" />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center text-[#D4AF37]/50 text-xs font-bold">
                        {room.roomType.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-[#0F2E1E] dark:text-white line-clamp-1">{room.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{room.area} · {formatRent(room.rent)}</p>
                    <div className="flex gap-2 mt-2">
                      <span
                        className={cn(
                          'text-[10px] font-bold px-2 py-0.5 rounded-full capitalize inline-block border border-transparent',
                          room.status === 'approved' && 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
                          room.status === 'pending' && 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
                          room.status === 'rejected' && 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                        )}
                      >
                        {room.status}
                      </span>
                      {room.isFeatured && <span className="bg-amber-100 text-[#D4AF37] border border-[#D4AF37]/20 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5"><Star size={10} fill="currentColor" /> Featured</span>}
                      {room.isVerified && <span className="bg-teal-100 text-teal-600 border border-teal-200 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5"><Shield size={10} fill="currentColor" /> Verified</span>}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-[#1F2E1F] pt-2 flex items-center justify-between text-xs text-gray-400">
                  <p>Views: {room.views ?? 0}</p>
                  <p>Owner: {room.owner?.name ?? 'Admin'}</p>
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-[#1F2E1F]">
                  <Link href={`/rooms/${room._id}`} target="_blank" className="flex-1 flex items-center justify-center gap-1 bg-white border dark:bg-[#111A11] dark:border-white/10 text-xs py-2 rounded-xl min-h-[36px]">
                    <ExternalLink size={12} /> Link
                  </Link>
                  <button
                    onClick={() => handleOpenEditModal(room)}
                    className="flex-1 bg-[#16A34A] text-white text-xs font-semibold py-2 rounded-xl min-h-[36px]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleOpenDeleteConfirm(room)}
                    className="flex-1 border border-red-200 text-red-500 text-xs font-semibold py-2 rounded-xl min-h-[36px]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <span className="text-xs text-gray-400">
              Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of {total} stays
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 border rounded-lg disabled:opacity-40 min-h-[36px] min-w-[36px] flex items-center justify-center bg-white dark:bg-[#111A11] border-gray-200 dark:border-[#1F2E1F]"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    'min-h-[36px] min-w-[36px] rounded-lg text-xs font-medium border transition-all',
                    page === p
                      ? 'bg-[#16A34A] text-white border-[#16A34A]'
                      : 'bg-white dark:bg-[#111A11] border-gray-200 dark:border-[#1F2E1F] text-gray-600 dark:text-gray-400'
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 border rounded-lg disabled:opacity-40 min-h-[36px] min-w-[36px] flex items-center justify-center bg-white dark:bg-[#111A11] border-gray-200 dark:border-[#1F2E1F]"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Add/Edit Room Unified Modal */}
      <AnimatePresence>
        {editModalOpen && (
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
              className="bg-white dark:bg-[#111A11] border border-gray-200 dark:border-[#1F2E1F] rounded-3xl p-6 max-w-2xl w-full shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full bg-gray-100 dark:bg-white/5 p-1 min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X size={20} />
              </button>

              <h3 className="font-display text-xl text-[#0F2E1E] dark:text-white mb-4">
                {selectedRoom ? 'Edit Property Stay' : 'Add Property Stay'}
              </h3>

              <form onSubmit={handleSaveRoom} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Room Title *</label>
                    <input
                      required
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g. Furnished Single Room in McLeod Ganj"
                      className="w-full rounded-xl px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-sm text-[#1A1A1A] dark:text-white focus:border-[#16A34A] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Area *</label>
                    <select
                      value={showCustomInput ? 'custom' : (locations.some((a) => a.name === formArea) ? formArea : '')}
                      onChange={(e) => handleAreaSelect(e.target.value)}
                      className="w-full rounded-xl px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-sm text-[#1A1A1A] dark:text-white focus:border-[#16A34A] focus:outline-none"
                    >
                      <option value="">Select from list</option>
                      {locations.map((a) => (
                        <option key={a.slug} value={a.name}>
                          {a.name}
                        </option>
                      ))}
                      <option value="custom">+ Type custom location</option>
                    </select>

                    {showCustomInput && (
                      <input
                        type="text"
                        placeholder="Type your area name..."
                        value={customArea}
                        onChange={(e) => handleCustomAreaChange(e.target.value)}
                        className="w-full rounded-xl px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-sm text-[#1A1A1A] dark:text-white focus:border-[#16A34A] focus:outline-none mt-2"
                      />
                    )}

                    <p className="text-[10px] text-gray-400 mt-1">
                      {"Can't find your area? Select \"+ Type custom location\""}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Address *</label>
                  <input
                    required
                    type="text"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    placeholder="e.g. Temple Road, near HRTC Bus Stand"
                    className="w-full rounded-xl px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-sm text-[#1A1A1A] dark:text-white focus:border-[#16A34A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Describe stay amenities, vicinity, guidelines, landmarks..."
                    className="w-full rounded-xl px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-sm text-[#1A1A1A] dark:text-white focus:border-[#16A34A] focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Monthly Rent *</label>
                    <input
                      required
                      type="number"
                      value={formRent}
                      onChange={(e) => setFormRent(e.target.value)}
                      placeholder="e.g. 7000"
                      className="w-full rounded-xl px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-sm text-[#1A1A1A] dark:text-white focus:border-[#16A34A] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Deposit (₹)</label>
                    <input
                      type="number"
                      value={formDeposit}
                      onChange={(e) => setFormDeposit(e.target.value)}
                      placeholder="e.g. 10000"
                      className="w-full rounded-xl px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-sm text-[#1A1A1A] dark:text-white focus:border-[#16A34A] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">WhatsApp Phone *</label>
                    <input
                      required
                      type="tel"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full rounded-xl px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-sm text-[#1A1A1A] dark:text-white focus:border-[#16A34A] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Room Type</label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as any)}
                      className="w-full rounded-xl px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-sm text-[#1A1A1A] dark:text-white focus:border-[#16A34A] focus:outline-none"
                    >
                      {POST_ROOM_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Furnishing</label>
                    <select
                      value={formFurnishing}
                      onChange={(e) => setFormFurnishing(e.target.value as any)}
                      className="w-full rounded-xl px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-sm text-[#1A1A1A] dark:text-white focus:border-[#16A34A] focus:outline-none"
                    >
                      {POST_FURNISHING.map((f) => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Allowed Gender</label>
                    <select
                      value={formGender}
                      onChange={(e) => setFormGender(e.target.value as any)}
                      className="w-full rounded-xl px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-sm text-[#1A1A1A] dark:text-white focus:border-[#16A34A] focus:outline-none"
                    >
                      {GENDER_OPTIONS.map((g) => (
                        <option key={g.value} value={g.value}>{g.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Amenities grid checkboxes */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Amenities</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {POST_AMENITIES.map((a) => {
                      const active = formAmenities[a.key as keyof IRoomAmenities];
                      return (
                        <button
                          key={a.key}
                          type="button"
                          onClick={() => setFormAmenities(prev => ({ ...prev, [a.key]: !active }))}
                          className={cn(
                            'rounded-xl p-2 border text-xs text-left flex items-center gap-1.5 transition-all min-h-[38px]',
                            active
                              ? 'border-[#16A34A] bg-[#F0FDF4] dark:bg-[#0F2E1E]/40 text-[#16A34A]'
                              : 'border-gray-200 dark:border-[#1F2E1F]'
                          )}
                        >
                          {active && <CheckCircle2 size={12} className="text-[#16A34A]" />}
                          <span>{a.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Allowed For checkboxes */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Allowed For</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.keys(formAllowedFor).map((key) => {
                      const active = formAllowedFor[key as keyof IRoomAllowedFor];
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setFormAllowedFor(prev => ({ ...prev, [key]: !active }))}
                          className={cn(
                            'rounded-xl p-2 border text-xs text-left flex items-center gap-1.5 transition-all min-h-[38px] capitalize',
                            active
                              ? 'border-[#16A34A] bg-[#F0FDF4] dark:bg-[#0F2E1E]/40 text-[#16A34A]'
                              : 'border-gray-200 dark:border-[#1F2E1F]'
                          )}
                        >
                          {active && <CheckCircle2 size={12} className="text-[#16A34A]" />}
                          <span>{key}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Cloudinary Image Upload Uploader */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Room Stays Photos</label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                    {formImages.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-[#0A0F0A]">
                        <Image src={img} alt="" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 min-h-[22px] min-w-[22px] flex items-center justify-center"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {formImages.length < 6 && (
                      <label className="aspect-square rounded-xl border border-dashed border-gray-300 dark:border-[#1F2E1F] hover:border-[#16A34A] flex flex-col items-center justify-center text-gray-400 hover:text-[#16A34A] cursor-pointer transition-all">
                        {uploading ? (
                          <Loader size="sm" className="border-[#16A34A] border-t-transparent" />
                        ) : (
                          <>
                            <Upload size={16} />
                            <span className="text-[10px] mt-1">Upload</span>
                          </>
                        )}
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>

                {/* Admin Exclusive Fields */}
                <div className="bg-gray-50 dark:bg-[#0A0F0A] rounded-2xl p-4 border border-gray-200 dark:border-[#1F2E1F] grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="w-full rounded-xl px-4 py-2 bg-white dark:bg-[#111A11] border border-gray-200 dark:border-[#1F2E1F] text-xs font-semibold text-[#1A1A1A] dark:text-white focus:outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="flex flex-col justify-center">
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formFeatured}
                        onChange={(e) => setFormFeatured(e.target.checked)}
                        className="rounded text-[#16A34A] focus:ring-[#16A34A]"
                      />
                      <span>Mark as Featured</span>
                    </label>
                    {formFeatured && (
                      <input
                        type="date"
                        value={formFeaturedUntil}
                        onChange={(e) => setFormFeaturedUntil(e.target.value)}
                        className="mt-1 w-full rounded-lg px-2 py-1 bg-white dark:bg-[#111A11] border border-gray-200 dark:border-[#1F2E1F] text-[10px] focus:outline-none"
                      />
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formVerified}
                        onChange={(e) => setFormVerified(e.target.checked)}
                        className="rounded text-[#16A34A] focus:ring-[#16A34A]"
                      />
                      <span>Mark as Verified</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-[#1F2E1F]">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="border border-gray-300 dark:border-[#1F2E1F] text-gray-600 dark:text-gray-300 rounded-xl px-5 py-2.5 text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-[#16A34A] hover:bg-[#16A34A]/90 text-white rounded-xl px-6 py-2.5 text-sm font-semibold flex items-center gap-1.5 min-h-[40px]"
                  >
                    {saving && <Loader size="sm" className="border-white border-t-transparent" />}
                    Save Listing
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && selectedRoom && (
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
              className="bg-white dark:bg-[#111A11] border border-gray-200 dark:border-[#1F2E1F] rounded-3xl p-6 max-w-sm w-full shadow-2xl"
            >
              <h3 className="font-display text-xl text-[#0F2E1E] dark:text-white mb-2">Delete property stay?</h3>
              <p className="text-gray-500 text-sm mb-6">
                Are you sure you want to delete <span className="font-semibold text-brand-black dark:text-white">&quot;{selectedRoom.title}&quot;</span>? This action is permanent and cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 border border-gray-200 dark:border-[#1F2E1F] text-gray-600 dark:text-gray-300 rounded-xl py-2.5 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteRoom}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white rounded-xl py-2.5 text-sm font-semibold"
                >
                  Delete Stay
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
