'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Users, Shield, Home, Search, MoreVertical, Check, RefreshCw, Plus, Trash2, Key, X } from 'lucide-react';
import Loader from '@/components/ui/Loader';
import { FormField } from '@/components/ui/FormField';
import { cn } from '@/lib/utils';

interface User {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  role: 'user' | 'owner' | 'admin';
  createdAt?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', password: '', role: 'user' as 'user' | 'owner' | 'admin' });
  const [creating, setCreating] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const json = await res.json();
      if (json.success) {
        setUsers(json.data ?? []);
      } else {
        toast.error('Failed to fetch users');
      }
    } catch {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: 'user' | 'owner' | 'admin') => {
    setActiveMenuId(null);
    const toastId = toast.loading('Updating role...');
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('User role updated successfully', { id: toastId });
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      } else {
        toast.error(json.error ?? 'Role update failed', { id: toastId });
      }
    } catch {
      toast.error('Role update failed', { id: toastId });
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('User created successfully');
        setShowCreateModal(false);
        setNewUser({ name: '', email: '', phone: '', password: '', role: 'user' });
        fetchUsers();
      } else {
        toast.error(json.error ?? 'Failed to create user');
      }
    } catch {
      toast.error('An error occurred while creating user');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setActiveMenuId(null);
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    const toastId = toast.loading('Deleting user...');
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        toast.success('User deleted successfully', { id: toastId });
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      } else {
        toast.error(json.error ?? 'Failed to delete user', { id: toastId });
      }
    } catch {
      toast.error('Failed to delete user', { id: toastId });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    setChangingPassword(true);
    try {
      const res = await fetch(`/api/users/${selectedUser._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Password updated successfully');
        setShowPasswordModal(false);
        setNewPassword('');
        setSelectedUser(null);
      } else {
        toast.error(json.error ?? 'Failed to update password');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setChangingPassword(false);
    }
  };

  const total = users.length;
  const admins = users.filter((u) => u.role === 'admin').length;
  const owners = users.filter((u) => u.role === 'owner').length;
  const seekers = users.filter((u) => u.role === 'user').length;

  const stats = [
    { label: 'Total Users', value: total, icon: Users, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20' },
    { label: 'Admins', value: admins, icon: Shield, color: 'text-[#D4AF37] bg-[#D4AF37]/10' },
    { label: 'Room Owners', value: owners, icon: Home, color: 'text-[#16A34A] bg-[#F0FDF4] dark:bg-[#0F2E1E]/30' },
    { label: 'Room Seekers', value: seekers, icon: Search, color: 'text-gray-500 bg-gray-50 dark:bg-white/5' },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader size="lg" className="border-[#16A34A] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#1F2E1F] pb-6">
        <h1 className="font-display text-2xl text-[#0F2E1E] dark:text-white font-semibold">User Management</h1>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setLoading(true);
              fetchUsers();
            }}
            className="p-2 rounded-xl bg-white dark:bg-[#111A11] border border-gray-200 dark:border-[#1F2E1F] hover:bg-gray-50 dark:hover:bg-[#0F2E1E]/30 text-gray-500 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-[#16A34A] text-white hover:bg-[#D4AF37] transition-colors flex items-center gap-2 font-semibold text-sm"
          >
            <Plus size={18} />
            Add User
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-white dark:bg-[#111A11] rounded-2xl p-5 border border-gray-100 dark:border-[#1F2E1F] shadow-sm flex items-center gap-4 animate-in fade-in"
            >
              <span className={cn('p-3 rounded-xl shrink-0', s.color)}>
                <Icon size={24} />
              </span>
              <div>
                <p className="font-display text-2xl md:text-3xl text-[#0F2E1E] dark:text-white font-bold">{s.value}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-[#111A11] rounded-2xl border border-gray-100 dark:border-[#1F2E1F] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-[#1F2E1F] bg-gray-50/50 dark:bg-[#0A0F0A]/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Phone Number</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#1F2E1F] text-sm">
              {users.map((u) => {
                const initial = u.name?.charAt(0)?.toUpperCase() ?? 'U';
                return (
                  <tr key={u._id} className="hover:bg-gray-50/30 dark:hover:bg-[#0A0F0A]/10">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0F2E1E] text-[#D4AF37] font-bold font-display flex items-center justify-center shrink-0">
                          {initial}
                        </div>
                        <div>
                          <span className="font-medium text-[#0F2E1E] dark:text-white block">{u.name}</span>
                          {u.email && <span className="text-xs text-gray-500 block">{u.email}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono">{u.phone}</td>
                    <td className="px-6 py-4 font-sans">
                      {u.role === 'admin' ? (
                        <span className="bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/20 text-xs font-bold rounded-full px-2.5 py-1">
                          Admin
                        </span>
                      ) : u.role === 'owner' ? (
                        <span className="bg-[#0F2E1E]/10 text-[#0F2E1E] border border-[#0F2E1E]/20 dark:bg-[#0F2E1E]/30 dark:text-white dark:border-[#0F2E1E]/40 text-xs font-bold rounded-full px-2.5 py-1">
                          Room Owner
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-700 border border-gray-200 dark:bg-white/5 dark:text-gray-300 dark:border-white/10 text-xs font-bold rounded-full px-2.5 py-1">
                          Room Seeker
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === u._id ? null : u._id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-gray-600 dark:hover:text-white min-h-[36px] min-w-[36px]"
                        aria-label="Actions"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {activeMenuId === u._id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveMenuId(null)}
                          />
                          <div className="absolute right-6 top-12 bg-white dark:bg-[#111A11] rounded-2xl shadow-xl border border-gray-100 dark:border-[#1F2E1F] py-2 z-20 min-w-[190px] text-left">
                            <button
                              onClick={() => handleRoleChange(u._id, 'user')}
                              className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-[#F0FDF4] dark:hover:bg-[#0F2E1E]/30 hover:text-[#16A34A] transition-colors"
                            >
                              <span>Change to Room Seeker</span>
                              {u.role === 'user' && <Check size={14} className="text-[#16A34A]" />}
                            </button>
                            <button
                              onClick={() => handleRoleChange(u._id, 'owner')}
                              className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-[#F0FDF4] dark:hover:bg-[#0F2E1E]/30 hover:text-[#16A34A] transition-colors"
                            >
                              <span>Change to Room Owner</span>
                              {u.role === 'owner' && <Check size={14} className="text-[#16A34A]" />}
                            </button>
                            <button
                              onClick={() => handleRoleChange(u._id, 'admin')}
                              className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-[#F0FDF4] dark:hover:bg-[#0F2E1E]/30 hover:text-[#16A34A] transition-colors"
                            >
                              <span>Change to Admin</span>
                              {u.role === 'admin' && <Check size={14} className="text-[#16A34A]" />}
                            </button>
                            <div className="h-px bg-gray-100 dark:bg-[#1F2E1F] my-1" />
                            <button
                              onClick={() => {
                                setSelectedUser(u);
                                setShowPasswordModal(true);
                                setActiveMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                            >
                              <Key size={14} />
                              <span>Set Password</span>
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 size={14} />
                              <span>Delete User</span>
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white dark:bg-[#111A11] rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-[#1F2E1F]">
                <h3 className="font-display text-xl text-[#0F2E1E] dark:text-white font-semibold">
                  Add New User
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                <FormField
                  label="Full Name"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                />
                <FormField
                  label="Email"
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="rahul@example.com"
                />
                <FormField
                  label="Phone Number"
                  required
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
                <FormField
                  label="Password"
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Min 6 characters"
                />
                <div>
                  <label className="block text-sm font-medium text-[#0F2E1E] dark:text-white mb-2">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#1F2E1F] bg-white dark:bg-[#0A0F0A] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#16A34A] focus:border-transparent outline-none transition-all"
                  >
                    <option value="user">Room Seeker</option>
                    <option value="owner">Room Owner</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-[#1F2E1F] text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 py-2.5 rounded-xl bg-[#16A34A] text-white font-semibold hover:bg-[#D4AF37] transition-colors flex items-center justify-center gap-2"
                  >
                    {creating ? <Loader size="sm" className="!w-4 !h-4 border-2 border-white border-t-transparent" /> : 'Create User'}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}

        {showPasswordModal && selectedUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowPasswordModal(false);
                setNewPassword('');
                setSelectedUser(null);
              }}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm bg-white dark:bg-[#111A11] rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-[#1F2E1F]">
                <div>
                  <h3 className="font-display text-xl text-[#0F2E1E] dark:text-white font-semibold">
                    Set Password
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">For {selectedUser.name}</p>
                </div>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setNewPassword('');
                    setSelectedUser(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleChangePassword} className="p-6 space-y-4">
                <FormField
                  label="New Password"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                />
                
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={changingPassword || newPassword.length < 6}
                    className="w-full py-2.5 rounded-xl bg-[#16A34A] text-white font-semibold hover:bg-[#D4AF37] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {changingPassword ? <Loader size="sm" className="!w-4 !h-4 border-2 border-white border-t-transparent" /> : 'Save Password'}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
