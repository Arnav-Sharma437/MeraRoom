'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  MapPin,
  Search,
  Plus,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Home,
  X,
  CheckCircle,
  Upload,
} from 'lucide-react';
import Loader from '@/components/ui/Loader';
import axios from 'axios';

interface AreaItem {
  name: string;
  slug: string;
  isActive: boolean;
  roomCount: number;
  image?: string;
}

export default function LocationsPage() {
  const [areas, setAreas] = useState<AreaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals / Actions
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editArea, setEditArea] = useState<AreaItem | null>(null);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newIsActive, setNewIsActive] = useState(true);
  const [newImage, setNewImage] = useState<string | undefined>(undefined);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      // Fetch stats to get dynamic room counts by area
      const statsRes = await fetch('/api/admin/stats');
      const statsJson = await statsRes.json();
      
      const countsMap: Record<string, number> = {};
      if (statsJson.success && statsJson.data?.charts?.roomsByArea) {
        statsJson.data.charts.roomsByArea.forEach((item: any) => {
          countsMap[item.name] = item.rooms;
        });
      }

      // Static list of Dharamshala areas from constants, initialized in state
      const initialAreas = [
        { name: 'McLeod Ganj', slug: 'mcleod-ganj', isActive: true },
        { name: 'Shyam Nagar', slug: 'shyam-nagar', isActive: true },
        { name: 'Dari', slug: 'dari', isActive: true },
        { name: 'Sakoh', slug: 'sakoh', isActive: true },
        { name: 'Kotwali Bazaar', slug: 'kotwali-bazaar', isActive: true },
        { name: 'Sidhpur', slug: 'sidhpur', isActive: true },
        { name: 'Ramnagar', slug: 'ramnagar', isActive: true },
        { name: 'Khanyara', slug: 'khanyara', isActive: true },
        { name: 'Forsyth Ganj', slug: 'forsyth-ganj', isActive: true },
        { name: 'Jogiwara Road', slug: 'jogiwara-road', isActive: true },
        { name: 'Bhagsu', slug: 'bhagsu', isActive: true },
        { name: 'Naddi', slug: 'naddi', isActive: true },
        { name: 'Upper Dharamshala', slug: 'upper-dharamshala', isActive: true },
        { name: 'Lower Dharamshala', slug: 'lower-dharamshala', isActive: true },
        { name: 'Chamunda', slug: 'chamunda', isActive: true },
        { name: 'Dharamkot', slug: 'dharamkot', isActive: true },
        { name: 'Palampur Road', slug: 'palampur-road', isActive: true },
      ].map((item) => ({
        ...item,
        roomCount: countsMap[item.name] ?? 0,
      }));

      // Check if there are any added locations saved in MongoDB settings
      const settingsRes = await fetch('/api/admin/settings');
      const settingsJson = await settingsRes.json();
      if (settingsJson.success && settingsJson.data?.custom_locations) {
        const custom = settingsJson.data.custom_locations;
        if (Array.isArray(custom)) {
          custom.forEach((c: any) => {
            const index = initialAreas.findIndex((a) => a.slug === c.slug);
            if (index > -1) {
              initialAreas[index].isActive = c.isActive;
              initialAreas[index].name = c.name;
              if (c.image) initialAreas[index].image = c.image;
            } else {
              initialAreas.push({
                name: c.name,
                slug: c.slug,
                isActive: c.isActive ?? true,
                roomCount: countsMap[c.name] ?? 0,
                image: c.image,
              });
            }
          });
        }
      }

      setAreas(initialAreas);
    } catch {
      toast.error('Failed to load localities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const syncLocationsWithSettings = async (updatedList: AreaItem[]) => {
    try {
      const customLocations = updatedList.map((a) => ({
        name: a.name,
        slug: a.slug,
        isActive: a.isActive,
        image: a.image,
      }));

      await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ custom_locations: customLocations }),
      });
    } catch (err) {
      console.error('Failed to sync location settings:', err);
    }
  };

  const handleToggleActive = async (slug: string) => {
    const updated = areas.map((a) => (a.slug === slug ? { ...a, isActive: !a.isActive } : a));
    setAreas(updated);
    toast.success('Location visibility toggled');
    await syncLocationsWithSettings(updated);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'meraroom/locations');

    try {
      const res = await axios.post('/api/upload', formData);
      if (res.data.success) {
        setNewImage(res.data.url);
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Upload failed');
      }
    } catch (err) {
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddArea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setSubmitting(true);
    const slug = newSlug.trim() || newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Check duplication
    if (areas.some((a) => a.slug === slug)) {
      toast.error('Area with this slug already exists!');
      setSubmitting(false);
      return;
    }

    const newArea: AreaItem = {
      name: newName.trim(),
      slug,
      isActive: newIsActive,
      roomCount: 0,
      image: newImage,
    };

    const updated = [...areas, newArea];
    setAreas(updated);
    setAddModalOpen(false);
    setNewName('');
    setNewSlug('');
    setNewIsActive(true);
    setNewImage(undefined);
    setSubmitting(false);
    toast.success('New Dharamshala area added successfully!');
    await syncLocationsWithSettings(updated);
  };

  const handleOpenEdit = (area: AreaItem) => {
    setEditArea(area);
    setNewName(area.name);
    setNewSlug(area.slug);
    setNewIsActive(area.isActive);
    setNewImage(area.image);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editArea || !newName.trim()) return;

    setSubmitting(true);
    const updated = areas.map((a) =>
      a.slug === editArea.slug
        ? { ...a, name: newName.trim(), isActive: newIsActive, image: newImage }
        : a
    );
    setAreas(updated);
    setEditArea(null);
    setNewName('');
    setNewSlug('');
    setNewImage(undefined);
    setSubmitting(false);
    toast.success('Area updated successfully!');
    await syncLocationsWithSettings(updated);
  };

  const handleDeleteArea = async (slug: string) => {
    if (!window.confirm('Delete this area from the list?')) return;
    const updated = areas.filter((a) => a.slug !== slug);
    setAreas(updated);
    toast.success('Local area removed');
    await syncLocationsWithSettings(updated);
  };

  const filteredAreas = areas.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-[#1F2E1F] pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-[#0F2E1E] dark:text-white flex items-center gap-2">
            <MapPin className="text-[#D4AF37]" fill="currentColor" size={24} />
            Dharamshala Localities
          </h1>
          <p className="text-gray-500 text-xs mt-1">Manage the 17+ geographic areas, toggle their search availability, and track property listing distribution.</p>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="bg-[#16A34A] hover:bg-[#16A34A]/90 text-white rounded-xl px-5 py-3 text-xs font-semibold flex items-center gap-1.5 shrink-0 self-start sm:self-center"
        >
          <Plus size={16} /> Add Locality
        </button>
      </div>

      {/* Search Filter and Stats */}
      <div className="bg-white dark:bg-[#111A11] rounded-2xl p-4 border border-gray-100 dark:border-[#1F2E1F] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search areas..."
            className="w-full rounded-xl pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs text-[#1A1A1A] dark:text-white focus:outline-none"
          />
        </div>
        <span className="text-xs text-gray-400 font-medium">
          Showing {filteredAreas.length} of {areas.length} locations
        </span>
      </div>

      {loading ? (
        <div className="min-h-[30vh] flex flex-col items-center justify-center">
          <Loader size="lg" className="border-[#D4AF37] border-t-transparent" />
        </div>
      ) : filteredAreas.length === 0 ? (
        <div className="bg-white dark:bg-[#111A11] rounded-2xl py-12 text-center border border-gray-100 dark:border-[#1F2E1F] shadow-sm">
          <p className="text-gray-500 text-sm">No locations matching search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAreas.map((area) => (
            <div
              key={area.slug}
              className={`bg-white dark:bg-[#111A11] rounded-2xl p-5 border shadow-sm transition-all flex flex-col justify-between space-y-4 ${
                area.isActive
                  ? 'border-gray-100 dark:border-[#1F2E1F]'
                  : 'border-gray-200/50 dark:border-[#1F2E1F]/50 opacity-60'
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h3 className="font-semibold text-sm text-[#0F2E1E] dark:text-white">{area.name}</h3>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">/{area.slug}</p>
                </div>
                <button
                  onClick={() => handleToggleActive(area.slug)}
                  className={`p-1 rounded-full transition-colors ${
                    area.isActive ? 'text-[#16A34A]' : 'text-gray-400'
                  }`}
                  title={area.isActive ? 'Deactivate Area' : 'Activate Area'}
                >
                  {area.isActive ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs border-t border-gray-50 dark:border-[#1F2E1F] pt-3">
                <span className="text-gray-400 flex items-center gap-1">
                  <Home size={12} /> Stays count:
                </span>
                <span className="font-semibold text-[#0F2E1E] dark:text-white font-mono bg-gray-50 dark:bg-white/5 rounded px-2 py-0.5">
                  {area.roomCount} rooms
                </span>
              </div>

              <div className="flex gap-2 pt-1 border-t border-gray-50 dark:border-[#1F2E1F] text-xs">
                <button
                  onClick={() => handleOpenEdit(area)}
                  className="flex-1 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-xl py-2 font-semibold flex items-center justify-center gap-1"
                >
                  <Edit size={12} /> Edit Name
                </button>
                <button
                  onClick={() => handleDeleteArea(area.slug)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"
                  title="Delete area"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Locality Modal */}
      <AnimatePresence>
        {addModalOpen && (
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
              className="bg-white dark:bg-[#111A11] border border-gray-200 dark:border-[#1F2E1F] rounded-3xl p-6 max-w-sm w-full shadow-2xl relative"
            >
              <button
                onClick={() => setAddModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full bg-gray-100 dark:bg-white/5 p-1 min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X size={16} />
              </button>

              <h3 className="font-display text-lg text-[#0F2E1E] dark:text-white mb-1">Add Locality</h3>
              <p className="text-gray-500 text-xs mb-4">Add a new area under Dharamshala City listings.</p>

              <form onSubmit={handleAddArea} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Area Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Dari Bridge"
                    className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs text-[#1A1A1A] dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">URL Slug (Optional)</label>
                  <input
                    type="text"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                    placeholder="e.g. dari-bridge"
                    className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs text-[#1A1A1A] dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Area Image (Optional)</label>
                  <div className="flex items-center gap-4">
                    {newImage ? (
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-[#1F2E1F]">
                        <Image src={newImage} alt="Area" fill className="object-cover" unoptimized />
                        <button type="button" onClick={() => setNewImage(undefined)} className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5 text-white hover:bg-black/70">
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer bg-gray-50 dark:bg-[#0A0F0A] border border-dashed border-gray-300 dark:border-[#1F2E1F] rounded-xl flex flex-col items-center justify-center w-16 h-16 hover:bg-gray-100 dark:hover:bg-[#111A11] transition-colors">
                        {uploadingImage ? <Loader size="sm" className="border-[#16A34A] border-t-transparent" /> : <Upload size={16} className="text-gray-400" />}
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                      </label>
                    )}
                    <span className="text-xs text-gray-500">Upload a cover image</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-y border-gray-50 dark:border-[#1F2E1F]">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Searchable Status</span>
                  <button
                    type="button"
                    onClick={() => setNewIsActive(!newIsActive)}
                    className={`p-1 rounded-full ${newIsActive ? 'text-[#16A34A]' : 'text-gray-400'}`}
                  >
                    {newIsActive ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                  </button>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setAddModalOpen(false)}
                    className="flex-1 border border-gray-300 dark:border-[#1F2E1F] text-gray-600 dark:text-gray-300 rounded-xl py-2.5 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-[#16A34A] hover:bg-[#16A34A]/90 text-white rounded-xl py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    {submitting && <Loader size="sm" className="border-white border-t-transparent" />}
                    Add Area
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Locality Modal */}
      <AnimatePresence>
        {editArea !== null && (
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
              className="bg-white dark:bg-[#111A11] border border-gray-200 dark:border-[#1F2E1F] rounded-3xl p-6 max-w-sm w-full shadow-2xl relative"
            >
              <button
                onClick={() => setEditArea(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full bg-gray-100 dark:bg-white/5 p-1 min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X size={16} />
              </button>

              <h3 className="font-display text-lg text-[#0F2E1E] dark:text-white mb-1">Edit Locality</h3>
              <p className="text-gray-500 text-xs mb-4">Edit name details for &quot;{editArea.name}&quot;.</p>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Area Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Area name"
                    className="w-full rounded-xl px-3 py-2 bg-gray-50 dark:bg-[#0A0F0A] border border-gray-200 dark:border-[#1F2E1F] text-xs text-[#1A1A1A] dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Area Image (Optional)</label>
                  <div className="flex items-center gap-4">
                    {newImage ? (
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-[#1F2E1F]">
                        <Image src={newImage} alt="Area" fill className="object-cover" unoptimized />
                        <button type="button" onClick={() => setNewImage(undefined)} className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5 text-white hover:bg-black/70">
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer bg-gray-50 dark:bg-[#0A0F0A] border border-dashed border-gray-300 dark:border-[#1F2E1F] rounded-xl flex flex-col items-center justify-center w-16 h-16 hover:bg-gray-100 dark:hover:bg-[#111A11] transition-colors">
                        {uploadingImage ? <Loader size="sm" className="border-[#D4AF37] border-t-transparent" /> : <Upload size={16} className="text-gray-400" />}
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                      </label>
                    )}
                    <span className="text-xs text-gray-500">Upload a cover image</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-y border-gray-50 dark:border-[#1F2E1F]">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Searchable Status</span>
                  <button
                    type="button"
                    onClick={() => setNewIsActive(!newIsActive)}
                    className={`p-1 rounded-full ${newIsActive ? 'text-[#16A34A]' : 'text-gray-400'}`}
                  >
                    {newIsActive ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                  </button>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditArea(null)}
                    className="flex-1 border border-gray-300 dark:border-[#1F2E1F] text-gray-600 dark:text-gray-300 rounded-xl py-2.5 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-[#D4AF37] text-[#0F2E1E] rounded-xl py-2.5 text-xs font-semibold hover:brightness-110 flex items-center justify-center gap-1.5"
                  >
                    {submitting && <Loader size="sm" className="border-[#0F2E1E] border-t-transparent" />}
                    Save Changes
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
