'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FormField } from '@/components/ui/FormField';
import Loader from '@/components/ui/Loader';

export default function OwnerProfilePage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [memberSince, setMemberSince] = useState('');

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/users/me');
      const json = await res.json();
      if (json.success && json.data) {
        setName(json.data.name ?? '');
        setPhone(json.data.phone ?? '');
        if (json.data.createdAt) {
          setMemberSince(
            new Date(json.data.createdAt).toLocaleDateString('en-IN', {
              month: 'long',
              year: 'numeric',
            })
          );
        }
      }
    }
    load();
  }, []);

  const initial = name?.charAt(0)?.toUpperCase() ?? 'O';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Profile updated!');
        await update({ name });
      } else {
        toast.error(json.error ?? 'Update failed');
      }
    } catch {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl text-[#0F2E1E] dark:text-white mb-8">My Profile</h1>

      <div className="bg-white dark:bg-[#111A11] rounded-3xl p-8 text-center border border-gray-100 dark:border-[#1F2E1F] mb-8">
        <div className="w-20 h-20 mx-auto rounded-full bg-[#0F2E1E] text-[#D4AF37] font-display text-3xl flex items-center justify-center">
          {initial}
        </div>
        <p className="font-semibold text-xl mt-4 text-[#0F2E1E] dark:text-white">{name || session?.user?.name}</p>
        <p className="text-[#16A34A] text-sm font-medium mt-1">Property Owner</p>
        {memberSince && <p className="text-gray-400 text-xs mt-2">Member since {memberSince}</p>}
      </div>

      <form onSubmit={handleSave}>
        <FormField label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <FormField label="Phone Number" value={phone} readOnly className="opacity-60" />
        <motion.button
          type="submit"
          disabled={saving}
          whileTap={{ scale: 0.96 }}
          className="w-full bg-[#16A34A] text-white rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {saving ? <Loader size="sm" className="!w-5 !h-5 border-2 border-white border-t-transparent" /> : null}
          Save Changes
        </motion.button>
      </form>

      <button
        type="button"
        onClick={() => signOut({ callbackUrl: '/' })}
        className="w-full mt-8 border-2 border-red-200 text-red-500 font-semibold rounded-xl py-3.5 hover:bg-red-50 dark:hover:bg-red-900/20 transition-default"
      >
        Logout
      </button>
    </div>
  );
}
