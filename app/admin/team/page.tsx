'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Users2,
  Plus,
  Edit2,
  Trash2,
  Upload,
  X,
  ArrowUp,
  ArrowDown,
  Lock,
} from 'lucide-react';
import Loader from '@/components/ui/Loader';
import { cn } from '@/lib/utils';

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  category?: 'core' | 'investor';
  image?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [category, setCategory] = useState<'core' | 'investor'>('core');
  const [image, setImage] = useState('');
  const [order, setOrder] = useState('0');
  const [isActive, setIsActive] = useState(true);

  // Delete State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/team?all=true', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) {
        setMembers(json.data ?? []);
      } else {
        toast.error('Failed to load team members');
      }
    } catch {
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleOpenAddModal = () => {
    setEditingMember(null);
    setName('');
    setRole('');
    setCategory('core');
    setImage('');
    // Set order to next highest
    const maxOrder = members.reduce((max, m) => (m.order > max ? m.order : max), 0);
    setOrder(String(maxOrder + 1));
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setName(member.name);
    setRole(member.role);
    setCategory(member.category || 'core');
    setImage(member.image || '');
    setOrder(String(member.order));
    setIsActive(member.isActive);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (member: TeamMember) => {
    setMemberToDelete(member);
    setDeleteConfirmOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('folder', 'meraroom/team');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      const url = json.url ?? json.data?.url;
      if (url) {
        setImage(url);
        toast.success('Profile photo uploaded successfully');
      } else {
        toast.error('Failed to upload image');
      }
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleToggleActive = async (member: TeamMember) => {
    const newStatus = !member.isActive;
    try {
      const res = await fetch(`/api/team/${member._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`${member.name} status updated`);
        setMembers((prev) =>
          prev.map((m) => (m._id === member._id ? { ...m, isActive: newStatus } : m))
        );
      } else {
        toast.error(json.error ?? 'Failed to update status');
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) {
      toast.error('Please fill in Name and Role');
      return;
    }

    setSubmitting(true);
    const payload = {
      name,
      role,
      category,
      image: image || undefined,
      order: Number(order) || 0,
      isActive,
    };

    try {
      const url = editingMember ? `/api/team/${editingMember._id}` : '/api/team';
      const method = editingMember ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Team updated!');
        setIsModalOpen(false);
        fetchTeam();
      } else {
        toast.error(json.error ?? 'Failed to save team member details');
      }
    } catch {
      toast.error('Failed to save team member details');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;
    try {
      const res = await fetch(`/api/team/${memberToDelete._id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Team updated!');
        setDeleteConfirmOpen(false);
        setMemberToDelete(null);
        fetchTeam();
      } else {
        toast.error(json.error ?? 'Failed to delete team member');
      }
    } catch {
      toast.error('Failed to delete team member');
    }
  };

  // Drag and Drop ordering functions
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (isNaN(sourceIndex) || sourceIndex === targetIndex) return;

    const newMembers = [...members];
    const [removed] = newMembers.splice(sourceIndex, 1);
    newMembers.splice(targetIndex, 0, removed);

    // Save local state
    const reordered = newMembers.map((m, idx) => ({ ...m, order: idx + 1 }));
    setMembers(reordered);

    // Save in DB
    try {
      await Promise.all(
        reordered.map((m) =>
          fetch(`/api/team/${m._id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: m.order }),
          })
        )
      );
      toast.success('Team order updated!');
    } catch {
      toast.error('Failed to save team order');
    }
  };

  const moveItem = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= members.length) return;

    const newMembers = [...members];
    const temp = newMembers[index];
    newMembers[index] = newMembers[targetIndex];
    newMembers[targetIndex] = temp;

    const reordered = newMembers.map((m, idx) => ({ ...m, order: idx + 1 }));
    setMembers(reordered);

    try {
      await Promise.all(
        reordered.map((m) =>
          fetch(`/api/team/${m._id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: m.order }),
          })
        )
      );
      toast.success('Team order updated!');
    } catch {
      toast.error('Failed to save team order');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-gray-200 dark:border-[#1F2E1F] pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-[#0F2E1E] dark:text-white flex items-center gap-2">
            <Users2 className="text-[#D4AF37]" size={24} />
            Team Members
          </h1>
          <p className="text-gray-500 text-xs mt-1">Manage core team members displayed on the About and Contact layouts.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-[#16A34A] hover:bg-[#16A34A]/90 text-white rounded-xl px-4 py-2.5 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-center shrink-0"
        >
          <Plus size={14} /> Add Member
        </button>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center">
          <Loader size="lg" className="border-[#D4AF37] border-t-transparent" />
        </div>
      ) : (
        <div className="bg-white dark:bg-[#111A11] rounded-2xl border border-gray-100 dark:border-[#1F2E1F] shadow-sm overflow-hidden">
          <div className="p-4 bg-gray-50 dark:bg-[#0A0F0A] border-b border-gray-100 dark:border-[#1F2E1F] text-xs font-medium text-gray-400">
            Drag rows to reorder them, or use the arrow buttons.
          </div>

          {members.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-sm">No team members added yet.</div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-[#1F2E1F]">
              {members.map((member, index) => {
                const initial = member.name.charAt(0).toUpperCase();
                return (
                  <div
                    key={member._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className="p-4 flex items-center gap-4 hover:bg-gray-50/50 dark:hover:bg-[#0F2E1E]/10 transition-colors group cursor-grab active:cursor-grabbing"
                  >
                    {/* Reorder actions */}
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() => moveItem(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-[#D4AF37] disabled:opacity-30 min-h-[24px] min-w-[24px] flex items-center justify-center"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => moveItem(index, 'down')}
                        disabled={index === members.length - 1}
                        className="p-1 text-gray-400 hover:text-[#D4AF37] disabled:opacity-30 min-h-[24px] min-w-[24px] flex items-center justify-center"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>

                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-[#0F2E1E] flex items-center justify-center text-[#D4AF37] text-lg font-bold font-serif relative overflow-hidden shrink-0">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover rounded-full"
                          unoptimized
                        />
                      ) : (
                        initial
                      )}
                    </div>

                    {/* Member Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-[#0F2E1E] dark:text-white flex items-center gap-1.5 flex-wrap">
                        {member.name}
                        <span className="text-[10px] font-mono text-gray-400">Order: {member.order}</span>
                        <span className={cn(
                          "text-[9px] font-bold px-1.5 py-0.5 rounded capitalize",
                          member.category === 'investor' 
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400" 
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                        )}>
                          {member.category === 'investor' ? 'Investor' : 'Core'}
                        </span>
                      </h4>
                      <p className="text-xs text-[#16A34A] font-medium mt-0.5">{member.role}</p>
                    </div>

                    {/* Active toggle */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider hidden sm:inline">Active</span>
                        <button
                          onClick={() => handleToggleActive(member)}
                          className={cn(
                            'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                            member.isActive ? 'bg-[#16A34A]' : 'bg-gray-200 dark:bg-gray-800'
                          )}
                        >
                          <span
                            className={cn(
                              'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                              member.isActive ? 'translate-x-4' : 'translate-x-0'
                            )}
                          />
                        </button>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(member)}
                          className="p-2 text-gray-400 hover:text-[#16A34A] hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg min-h-[36px] min-w-[36px] flex items-center justify-center transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(member)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg min-h-[36px] min-w-[36px] flex items-center justify-center transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
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

              <h3 className="font-display text-lg text-[#0F2E1E] dark:text-white mb-1">
                {editingMember ? 'Edit Team Member' : 'Add Team Member'}
              </h3>
              <p className="text-gray-500 text-xs mb-4">Set credentials, title, ordering sequence, and upload a profile photo.</p>

              <form onSubmit={handleSaveMember} className="space-y-4 text-sm">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Name (Required)</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Arnav"
                    className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs text-[#1A1A1A] dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Role / Title (Required)</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Co-Founder & Developer"
                    className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs text-[#1A1A1A] dark:text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Display Order</label>
                    <input
                      type="number"
                      value={order}
                      onChange={(e) => setOrder(e.target.value)}
                      className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs text-[#1A1A1A] dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Active Toggle</label>
                    <div className="flex items-center gap-2 mt-1.5">
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
                      <span className="text-xs text-gray-500">{isActive ? 'Shown' : 'Hidden'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Member Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as 'core' | 'investor')}
                    className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs text-[#1A1A1A] dark:text-white focus:outline-none"
                  >
                    <option value="core">Core Team</option>
                    <option value="investor">Angel Investor / Advisor</option>
                  </select>
                </div>

                {/* Profile Photo Uploader */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Profile Photo (Optional)</label>
                  {image ? (
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-200 mb-2 mx-auto">
                      <Image src={image} alt="" fill className="object-cover" unoptimized />
                      <button
                        type="button"
                        onClick={() => setImage('')}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-sm shrink-0"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ) : (
                    <div className="border border-dashed border-gray-300 dark:border-white/10 rounded-xl p-4 text-center bg-gray-50 dark:bg-[#0A0F0A] relative hover:bg-gray-100 dark:hover:bg-[#0F2E1E]/10 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        disabled={uploading}
                      />
                      <Upload className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                      {uploading ? (
                        <p className="text-xs text-gray-400">Uploading photo...</p>
                      ) : (
                        <div>
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Click to upload photo</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Supports PNG, JPG (Max 5MB)</p>
                        </div>
                      )}
                    </div>
                  )}
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Or paste direct Cloudinary photo URL..."
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
                    Save Member
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmOpen && memberToDelete && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white dark:bg-[#111A11] border border-gray-200 dark:border-[#1F2E1F] rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center"
            >
              <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-display text-lg text-[#0F2E1E] dark:text-white mb-2">Remove Team Member</h3>
              <p className="text-gray-500 text-xs mb-6">
                Remove <span className="font-semibold text-gray-800 dark:text-white">{memberToDelete.name}</span> from team? This action is permanent.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="flex-1 border border-gray-300 dark:border-[#1F2E1F] text-gray-600 dark:text-gray-300 rounded-xl py-2.5 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteMember}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white rounded-xl py-2.5 text-xs font-semibold"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
