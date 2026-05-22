'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Share2,
  Heart,
  Home,
  Users,
  LayoutGrid,
  User as UserIcon,
  CircleDot,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { LucideByName } from '@/components/ui/LucideByName';
import { POST_AMENITIES } from '@/constants';
import { useSavedRooms } from '@/hooks/useSavedRooms';
import RoomImageGallery from '@/components/rooms/RoomImageGallery';
import RoomCard from '@/components/rooms/RoomCard';
import WhatsAppButton from '@/components/rooms/WhatsAppButton';
import type { Room, ApiResponse, User } from '@/types';
import { MOCK_FEATURED_ROOMS, ROOM_TYPES, FURNISHING_TYPES, GENDER_OPTIONS, CITY, getMockSearchRooms } from '@/constants';
import { cn, formatRent, getWhatsAppLink } from '@/lib/utils';
import { filterMockRooms, DEFAULT_FILTERS, enrichMockRoom } from '@/lib/filter-rooms';

interface RoomDetailClientProps {
  id: string;
}

const NEARBY_LANDMARKS: Record<string, string[]> = {
  'McLeod Ganj': ['McLeod Ganj Market — 0.3km', 'Tsuglagkhang Complex — 0.5km', 'HRTC Bus Stand — 1.2km'],
  Bhagsu: ['Bhagsu Waterfall — 0.8km', 'Bhagsu Nag Temple — 0.4km', 'Café strip — 0.2km'],
  Dharamkot: ['Dharamkot Village — 0.2km', 'Triund trail start — 1.5km', 'Yoga centres — 0.3km'],
  default: ['Local market — 0.5km', 'HRTC Bus Stand — 1.5km', 'Dharamshala Cricket Stadium — 3km'],
};

function DetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[280px] md:h-96 skeleton-shimmer" />
      <div className="container mx-auto px-4 py-8 max-w-6xl space-y-4">
        <div className="h-8 skeleton-shimmer w-2/3 rounded" />
        <div className="h-4 skeleton-shimmer w-1/2 rounded" />
        <div className="h-24 skeleton-shimmer rounded-2xl" />
        <div className="h-40 skeleton-shimmer rounded-2xl" />
      </div>
    </div>
  );
}

export default function RoomDetailClient({ id }: RoomDetailClientProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [similar, setSimilar] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const { isSaved, toggleSave } = useSavedRooms();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get<ApiResponse<Room>>(`/api/rooms/${id}`);
        if (data.success && data.data) {
          setRoom(data.data);
          loadSimilar(data.data.area, id);
        } else {
          loadMock();
        }
      } catch {
        loadMock();
      } finally {
        setLoading(false);
      }
    };

    const loadMock = () => {
      const mocks = getMockSearchRooms().map((r, i) => enrichMockRoom(r as Record<string, unknown>, i));
      const found = mocks.find((r) => r._id === id) ?? enrichMockRoom(MOCK_FEATURED_ROOMS[0] as Record<string, unknown>, 0);
      setRoom(found);
      setSimilar(filterMockRooms(mocks, { ...DEFAULT_FILTERS, areas: [] }, id).filter((r) => r.area === found.area).slice(0, 3));
    };

    const loadSimilar = async (area: string, excludeId: string) => {
      try {
        const params = new URLSearchParams({ area: area.toLowerCase().replace(/\s+/g, '-'), limit: '4', exclude: excludeId });
        const match = (await import('@/constants')).DHARAMSHALA_AREAS.find((a) => a.name === area);
        if (match) params.set('area', match.slug);
        const { data } = await axios.get<ApiResponse<Room[]>>(`/api/rooms?${params}`);
        if (data.success && data.data?.length) {
          setSimilar(data.data.slice(0, 3));
        } else {
          const mocks = getMockSearchRooms().map((r, i) => enrichMockRoom(r as Record<string, unknown>, i));
          setSimilar(filterMockRooms(mocks, DEFAULT_FILTERS, excludeId).filter((r) => r.area === area).slice(0, 3));
        }
      } catch {
        const mocks = getMockSearchRooms().map((r, i) => enrichMockRoom(r as Record<string, unknown>, i));
        setSimilar(filterMockRooms(mocks, DEFAULT_FILTERS, excludeId).filter((r) => r.area === area).slice(0, 3));
      }
    };

    load();
  }, [id]);

  if (loading) return <DetailSkeleton />;

  if (!room) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <Home className="w-16 h-16 mb-4 text-[#16A34A]/40" />
        <h1 className="font-display text-2xl text-[#0F2E1E] dark:text-white mb-2">Room not found</h1>
        <p className="text-gray-500 mb-6">This listing is no longer available in Dharamshala.</p>
        <Link href="/search" className="bg-[#16A34A] text-white font-semibold rounded-xl px-6 py-3">
          Back to Search
        </Link>
      </div>
    );
  }

  const owner = typeof room.owner === 'object' ? (room.owner as User) : null;
  const ownerName = owner?.name ?? 'Property Owner';
  const typeLabel = ROOM_TYPES.find((t) => t.value === room.roomType)?.label ?? room.roomType;
  const furnishLabel = FURNISHING_TYPES.find((f) => f.value === room.furnishing)?.label ?? room.furnishing;
  const genderLabel = GENDER_OPTIONS.find((g) => g.value === room.gender)?.label ?? 'Any';
  const whatsappMsg = `Hi, I saw your room "${room.title}" on MeraRoom. Is it still available?`;
  const whatsappHref = getWhatsAppLink(room.whatsappNumber, whatsappMsg);
  const phoneHref = `tel:+${room.whatsappNumber.replace(/\D/g, '')}`;
  const landmarks = NEARBY_LANDMARKS[room.area] ?? NEARBY_LANDMARKS.default;
  const mapQuery = room.latitude && room.longitude
    ? `${room.latitude},${room.longitude}`
    : `${room.area}, Dharamshala, Himachal Pradesh`;
  const descLong = room.description?.length > 200;
  const allowedLabels = Object.entries(room.allowedFor ?? {})
    .filter(([, v]) => v)
    .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1));

  const contactCard = (
    <div className="bg-white dark:bg-[#111A11] rounded-2xl border border-gray-100 dark:border-[#1F2E1F] shadow-lg p-6">
      <p className="hidden md:block font-display text-2xl text-[#0F2E1E] dark:text-white">
        {formatRent(room.rent)}<span className="text-base font-sans text-gray-400">/month</span>
      </p>
      {room.deposit > 0 && (
        <p className="hidden md:block text-sm text-gray-400 mt-1">+{formatRent(room.deposit)} deposit</p>
      )}
      <span className="inline-flex items-center gap-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full px-3 py-1 text-sm mt-4 mb-4">
        <CircleDot size={14} className="inline mr-1" />
        Available Now
      </span>
      <div className="hidden md:flex items-center gap-3 mb-6 pb-6 border-b border-gray-100 dark:border-[#1F2E1F]">
        <div className="w-12 h-12 rounded-full bg-[#0F2E1E] text-[#D4AF37] flex items-center justify-center font-bold text-lg">
          {ownerName.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-[#0F2E1E] dark:text-white">{ownerName}</p>
          <p className="text-gray-500 text-sm">Property Owner</p>
          <p className="text-xs text-gray-400">Member since 2024</p>
        </div>
      </div>
      <WhatsAppButton href={whatsappHref} label="Chat on WhatsApp" size="lg" className="w-full mb-3" />
      <motion.a
        href={phoneHref}
        whileTap={{ scale: 0.96 }}
        className="flex items-center justify-center gap-2 border-2 border-[#0F2E1E] dark:border-white/20 text-[#0F2E1E] dark:text-white rounded-2xl py-3.5 w-full font-semibold min-h-[44px]"
      >
        <Phone size={20} /> Call Owner
      </motion.a>
      <p className="hidden md:block bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 mt-4 text-xs text-amber-700 dark:text-amber-300">
        <AlertTriangle size={14} className="inline mr-1 shrink-0" />
        Always visit the property before making any payment.
      </p>
    </div>
  );

  return (
    <div className="bg-white dark:bg-[#0A0F0A] min-h-screen pb-36 md:pb-12">
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
        <RoomImageGallery
          images={room.images ?? []}
          title={room.title}
          isSaved={isSaved(room._id)}
          onToggleSave={() => toggleSave(room._id)}
        />
      </motion.div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <nav className="hidden md:flex text-sm text-gray-400 gap-1 mb-3 flex-wrap">
                <Link href="/" className="hover:text-[#16A34A]">Home</Link>
                <span>/</span>
                <Link href="/search" className="hover:text-[#16A34A]">{CITY.name}</Link>
                <span>/</span>
                <span>{room.area}</span>
                <span>/</span>
                <span className="text-gray-600 dark:text-gray-300 line-clamp-1">{room.title}</span>
              </nav>
              <div className="flex items-start justify-between gap-4">
                <h1 className="font-display text-2xl md:text-3xl text-[#0F2E1E] dark:text-white">{room.title}</h1>
                <div className="hidden md:flex gap-2 flex-shrink-0">
                  <motion.button type="button" whileTap={{ scale: 0.96 }} onClick={() => navigator.share?.({ title: room.title, url: window.location.href })} className="p-2 border rounded-lg">
                    <Share2 size={18} />
                  </motion.button>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    onClick={() => toggleSave(room._id)}
                    className={cn(
                      'p-2 border rounded-lg',
                      isSaved(room._id) && 'bg-red-50 border-red-200 text-red-500'
                    )}
                  >
                    <Heart size={18} className={isSaved(room._id) ? 'fill-current' : ''} />
                  </motion.button>
                </div>
              </div>
              <p className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-2">
                <MapPin size={16} className="text-[#16A34A]" />
                {room.area}, {CITY.name}, HP
              </p>
              <a href={`#map`} className="text-[#16A34A] text-sm underline hover:text-[#D4AF37] mt-1 inline-block">
                View on Map
              </a>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-xs bg-[#0F2E1E] text-white rounded-full px-3 py-1">{typeLabel}</span>
                <span className="text-xs bg-[#F0FDF4] dark:bg-[#0F2E1E] text-[#16A34A] border border-[#D1FAE5] rounded-full px-3 py-1">{furnishLabel}</span>
                <span className="text-xs bg-gray-100 dark:bg-[#1A2A1A] text-gray-600 dark:text-gray-300 rounded-full px-3 py-1">{genderLabel}</span>
                {room.isAvailable && (
                  <span className="text-xs bg-green-100 text-green-700 rounded-full px-3 py-1">Available</span>
                )}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-[#F0FDF4] dark:bg-[#0F2E1E]/30 rounded-2xl p-4 flex flex-wrap gap-6 justify-between"
            >
              <div>
                <p className="font-display text-3xl text-[#0F2E1E] dark:text-white">{formatRent(room.rent)}</p>
                <p className="text-gray-400 text-sm">/month</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <span className="inline-flex items-center gap-1"><Home size={14} /> {typeLabel}</span>
                <span className="inline-flex items-center gap-1"><Users size={14} /> {allowedLabels.join(', ') || 'All'}</span>
                <span className="inline-flex items-center gap-1"><LayoutGrid size={14} /> {furnishLabel}</span>
                <span className="inline-flex items-center gap-1"><UserIcon size={14} /> {genderLabel}</span>
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="font-display text-xl text-[#0F2E1E] dark:text-white mb-3">About this Room</h2>
              <p className={`text-gray-600 dark:text-gray-300 leading-relaxed ${!expanded && descLong ? 'line-clamp-4' : ''}`}>
                {room.description}
              </p>
              {descLong && (
                <button type="button" onClick={() => setExpanded(!expanded)} className="text-[#16A34A] text-sm font-medium mt-2">
                  {expanded ? 'Read less' : 'Read more'}
                </button>
              )}
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <h2 className="font-display text-xl text-[#0F2E1E] dark:text-white mb-4">Amenities & Facilities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {POST_AMENITIES.map((a, i) => {
                  const available = room.amenities[a.key as keyof typeof room.amenities];
                  return (
                    <motion.div
                      key={a.key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className={`bg-white dark:bg-[#111A11] border border-gray-100 dark:border-[#1F2E1F] rounded-xl p-3 flex items-center gap-3 ${!available ? 'opacity-50' : ''}`}
                    >
                      <span className="bg-[#F0FDF4] dark:bg-[#0F2E1E]/50 rounded-lg p-2 text-[#16A34A]">
                        <LucideByName name={a.icon} size={18} />
                      </span>
                      <span className={`text-sm ${available ? 'text-[#0F2E1E] dark:text-white' : 'text-gray-300 line-through'}`}>{a.label}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>

            <motion.section id="map" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="font-display text-xl text-[#0F2E1E] dark:text-white mb-3">Location</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                {room.address ?? `${room.area}, ${CITY.name}, Himachal Pradesh 176219`}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {landmarks.map((l) => (
                  <span key={l} className="bg-gray-100 dark:bg-[#1A2A1A] rounded-full text-xs px-3 py-1 text-gray-600 dark:text-gray-400">
                    {l}
                  </span>
                ))}
              </div>
              <div className="rounded-2xl overflow-hidden h-[300px] bg-gray-100 dark:bg-[#111A11]">
                {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                  <iframe
                    title="Room location map"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(mapQuery)}&zoom=14`}
                  />
                ) : (
                  <iframe
                    title="Room location map"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=14&output=embed`}
                  />
                )}
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <h2 className="font-display text-xl text-[#0F2E1E] dark:text-white mb-4">House Rules</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <p className="flex items-center gap-2"><CheckCircle size={14} className="text-[#16A34A]" /> Available For: {allowedLabels.join(', ') || 'Everyone'}</p>
                <p className="flex items-center gap-2"><CheckCircle size={14} className="text-[#16A34A]" /> Gender: {genderLabel}</p>
                <p className="flex items-center gap-2"><CheckCircle size={14} className="text-[#16A34A]" /> Pets: Contact owner</p>
                <p className="flex items-center gap-2"><CheckCircle size={14} className="text-[#16A34A]" /> ID proof required at move-in</p>
              </div>
            </motion.section>

            {similar.length > 0 && (
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <h2 className="font-display text-xl text-[#0F2E1E] dark:text-white mb-4">Similar Rooms Nearby</h2>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible pb-2">
                  {similar.map((r, i) => (
                    <div key={r._id} className="min-w-[280px] md:min-w-0 flex-shrink-0 md:flex-shrink">
                      <RoomCard room={r} index={i} />
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          <motion.aside
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="hidden lg:block lg:col-span-1"
          >
            <div className="sticky top-24">{contactCard}</div>
          </motion.aside>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] left-0 right-0 z-40 px-4 py-3 bg-white/95 dark:bg-[#111A11]/95 backdrop-blur border-t border-gray-200 dark:border-[#1F2E1F] flex gap-3">
        <WhatsAppButton href={whatsappHref} label="WhatsApp" size="md" className="flex-1" showLabel />
        <motion.a
          href={phoneHref}
          whileTap={{ scale: 0.96 }}
          className="flex-1 flex items-center justify-center gap-2 bg-[#16A34A] text-white rounded-xl py-3 font-semibold min-h-[44px]"
        >
          <Phone size={18} /> Call
        </motion.a>
      </div>
    </div>
  );
}
