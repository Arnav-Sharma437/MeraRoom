'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Settings,
  Phone,
  IndianRupee,
  Globe,
  Lock,
  Save,
  AlertTriangle,
} from 'lucide-react';
import Loader from '@/components/ui/Loader';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Settings state values
  const [contactArnav, setContactArnav] = useState('+91 7876650437');
  const [contactVarun, setContactVarun] = useState('+91 9418100803');
  const [priceFeatured, setPriceFeatured] = useState('399');
  const [priceVerified, setPriceVerified] = useState('199');
  const [priceAd, setPriceAd] = useState('999');
  const [siteName, setSiteName] = useState('MeraRoom');
  const [siteTagline, setSiteTagline] = useState('Find Your Perfect Room in Dharamshala');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Password reset state values
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resettingPassword, setResettingPassword] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        const json = await res.json();
        if (json.success && json.data) {
          const s = json.data;
          if (s.contact_whatsapp_arnav) setContactArnav(s.contact_whatsapp_arnav);
          if (s.contact_whatsapp_varun) setContactVarun(s.contact_whatsapp_varun);
          if (s.price_featured) setPriceFeatured(String(s.price_featured));
          if (s.price_verified) setPriceVerified(String(s.price_verified));
          if (s.price_ad) setPriceAd(String(s.price_ad));
          if (s.site_name) setSiteName(s.site_name);
          if (s.site_tagline) setSiteTagline(s.site_tagline);
          if (s.maintenance_mode !== undefined) setMaintenanceMode(!!s.maintenance_mode);
        }
      } catch {
        toast.error('Failed to load site settings');
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact_whatsapp_arnav: contactArnav,
          contact_whatsapp_varun: contactVarun,
          price_featured: Number(priceFeatured),
          price_verified: Number(priceVerified),
          price_ad: Number(priceAd),
          site_name: siteName,
          site_tagline: siteTagline,
          maintenance_mode: maintenanceMode,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Site configurations saved successfully!');
      } else {
        toast.error(json.error ?? 'Failed to save configurations');
      }
    } catch {
      toast.error('Failed to save configurations');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setResettingPassword(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Admin password updated successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(json.error ?? 'Password update failed');
      }
    } catch {
      toast.error('Password update failed');
    } finally {
      setResettingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader size="lg" className="border-[#D4AF37] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-[#1F2E1F] pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-[#0F2E1E] dark:text-white flex items-center gap-2">
            <Settings className="text-[#D4AF37]" size={24} />
            Website Settings
          </h1>
          <p className="text-gray-500 text-xs mt-1">Configure pricing values, global contact directories, site name branding, and manage admin credentials.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Main configurations form */}
        <form onSubmit={handleSaveSettings} className="lg:col-span-2 space-y-6">
          {/* Section 1: Contact Details */}
          <div className="bg-white dark:bg-[#111A11] rounded-2xl p-5 border border-gray-100 dark:border-[#1F2E1F] shadow-sm space-y-4">
            <h3 className="font-semibold text-sm text-[#0F2E1E] dark:text-white flex items-center gap-1.5 border-b border-gray-50 dark:border-white/5 pb-2">
              <Phone className="text-brand-green shrink-0" size={16} /> Contact WhatsApp Numbers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Arnav WhatsApp</label>
                <input
                  type="text"
                  required
                  value={contactArnav}
                  onChange={(e) => setContactArnav(e.target.value)}
                  placeholder="e.g. +91 7876650437"
                  className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs text-[#1A1A1A] dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Varun WhatsApp</label>
                <input
                  type="text"
                  required
                  value={contactVarun}
                  onChange={(e) => setContactVarun(e.target.value)}
                  placeholder="e.g. +91 9418100803"
                  className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs text-[#1A1A1A] dark:text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pricing Slots */}
          <div className="bg-white dark:bg-[#111A11] rounded-2xl p-5 border border-gray-100 dark:border-[#1F2E1F] shadow-sm space-y-4">
            <h3 className="font-semibold text-sm text-[#0F2E1E] dark:text-white flex items-center gap-1.5 border-b border-gray-50 dark:border-white/5 pb-2">
              <IndianRupee className="text-[#D4AF37] shrink-0" size={16} /> Premium Service Pricing (₹)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Featured Listing (30d)</label>
                <input
                  type="number"
                  required
                  value={priceFeatured}
                  onChange={(e) => setPriceFeatured(e.target.value)}
                  placeholder="399"
                  className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs text-[#1A1A1A] dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Verification Badge</label>
                <input
                  type="number"
                  required
                  value={priceVerified}
                  onChange={(e) => setPriceVerified(e.target.value)}
                  placeholder="199"
                  className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs text-[#1A1A1A] dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Promotional Ad Slot</label>
                <input
                  type="number"
                  required
                  value={priceAd}
                  onChange={(e) => setPriceAd(e.target.value)}
                  placeholder="999"
                  className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs text-[#1A1A1A] dark:text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Branding & Site Settings */}
          <div className="bg-white dark:bg-[#111A11] rounded-2xl p-5 border border-gray-100 dark:border-[#1F2E1F] shadow-sm space-y-4">
            <h3 className="font-semibold text-sm text-[#0F2E1E] dark:text-white flex items-center gap-1.5 border-b border-gray-50 dark:border-white/5 pb-2">
              <Globe className="text-blue-500 shrink-0" size={16} /> Site Identity & Maintenance
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Site Branding Title</label>
                <input
                  type="text"
                  required
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="MeraRoom"
                  className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs text-[#1A1A1A] dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Default Tagline Description</label>
                <input
                  type="text"
                  required
                  value={siteTagline}
                  onChange={(e) => setSiteTagline(e.target.value)}
                  placeholder="Find Your Perfect Room..."
                  className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs text-[#1A1A1A] dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="border-t border-gray-50 dark:border-white/5 pt-4 flex items-center justify-between">
              <div className="space-y-0.5 max-w-[80%]">
                <span className="text-xs font-semibold text-gray-800 dark:text-white flex items-center gap-1">
                  <AlertTriangle className="text-amber-500 shrink-0" size={14} /> Maintenance Lock Mode
                </span>
                <p className="text-[10px] text-gray-400">Lock user frontend interfaces, showing a maintenance downtime notice screen. Admin dashboard remains fully functional.</p>
              </div>
              <button
                type="button"
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 cursor-pointer ${
                  maintenanceMode ? 'bg-red-500' : 'bg-gray-300 dark:bg-white/10'
                }`}
              >
                <span
                  className={`w-4 h-4 bg-white rounded-full transition-transform shadow-md ${
                    maintenanceMode ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Save Configurations Actions */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#16A34A] hover:bg-[#16A34A]/90 text-white rounded-xl px-6 py-3.5 text-xs font-semibold flex items-center gap-1.5 shadow-sm min-h-[44px]"
            >
              {saving ? <Loader size="sm" className="border-white border-t-transparent" /> : <Save size={16} />}
              Save All Settings
            </button>
          </div>
        </form>

        {/* Right column: Admin Credentials Reset */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#111A11] rounded-2xl p-5 border border-gray-100 dark:border-[#1F2E1F] shadow-sm space-y-4">
            <h3 className="font-semibold text-sm text-[#0F2E1E] dark:text-white flex items-center gap-1.5 border-b border-gray-50 dark:border-white/5 pb-2">
              <Lock className="text-red-500 shrink-0" size={16} /> Admin Account Password
            </h3>
            <p className="text-[10px] text-gray-400 leading-relaxed">Update administrative credentials. Ensure passwords exceed 6 characters and use mixed tokens.</p>
            
            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs text-[#1A1A1A] dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs text-[#1A1A1A] dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs text-[#1A1A1A] dark:text-white focus:outline-none"
                />
              </div>
              
              <button
                type="submit"
                disabled={resettingPassword}
                className="w-full bg-[#D4AF37] hover:brightness-110 text-[#0F2E1E] rounded-xl py-3 text-xs font-bold transition-all mt-2 flex items-center justify-center gap-1.5 shadow-sm min-h-[38px]"
              >
                {resettingPassword ? <Loader size="sm" className="border-[#0F2E1E] border-t-transparent" /> : <Save size={14} />}
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
