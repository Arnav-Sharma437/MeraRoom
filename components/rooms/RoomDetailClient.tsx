'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  ArrowLeft,
  X,
} from 'lucide-react';
import type { Room, ApiResponse } from '@/types';
import { MOCK_FEATURED_ROOMS, ROOM_TYPES } from '@/constants';
import { formatRent, getWhatsAppLink } from '@/lib/utils';
import Loader from '@/components/ui/Loader';

interface RoomDetailClientProps {
  id: string;
}

export default function RoomDetailClient({ id }: RoomDetailClientProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const { scrollY } = useScroll();
  const imageScale = useTransform(scrollY, [0, 200], [1, 0.85]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get<ApiResponse<Room>>(`/api/rooms/${id}`);
        if (data.success && data.data) setRoom(data.data);
        else {
          const mock = MOCK_FEATURED_ROOMS.find((r) => r._id === id);
          setRoom((mock ?? MOCK_FEATURED_ROOMS[0]) as unknown as Room);
        }
      } catch {
        const mock = MOCK_FEATURED_ROOMS.find((r) => r._id === id);
        setRoom((mock ?? MOCK_FEATURED_ROOMS[0]) as unknown as Room);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-brand-gray">Room not found</p>
      </div>
    );
  }

  const cityName =
    typeof room.city === 'object' && room.city !== null && 'name' in room.city
      ? (room.city as { name: string }).name
      : 'Dharamshala';
  const typeLabel =
    ROOM_TYPES.find((t) => t.value === room.roomType)?.label ?? room.roomType;
  const whatsappHref = getWhatsAppLink(
    room.whatsappNumber,
    `Hi, I'm interested in "${room.title}" on MeraRoom.`
  );
  const phoneHref = `tel:+${room.whatsappNumber.replace(/\D/g, '')}`;

  const amenitiesList = Object.entries(room.amenities)
    .filter(([, v]) => v)
    .map(([k]) => k);

  return (
    <div className="bg-white dark:bg-surface-dark min-h-screen pb-32 md:pb-8">
      <div className="md:hidden fixed top-14 left-0 right-0 z-40 flex items-center justify-between px-4 py-2 bg-brand-dark/90 backdrop-blur">
        <Link href="/search" className="min-w-[44px] min-h-[44px] flex items-center text-white">
          <ArrowLeft size={22} />
        </Link>
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={() => navigator.share?.({ title: room.title, url: window.location.href })}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-white"
        >
          <Share2 size={20} />
        </motion.button>
      </div>

      <motion.div
        style={{ scale: imageScale }}
        className="relative h-64 md:h-96 w-full overflow-hidden"
      >
        {room.images?.[0] ? (
          <button
            type="button"
            className="w-full h-full relative"
            onClick={() => setFullscreen(true)}
          >
            <Image src={room.images[0]} alt={room.title} fill className="object-cover" priority />
          </button>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-dark to-brand-green flex items-center justify-center text-6xl">
            🏔️
          </div>
        )}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <span className="bg-brand-dark/80 text-white text-xs rounded-full px-3 py-1">
            {typeLabel}
          </span>
          <span className="bg-black/70 text-white font-bold rounded-lg px-3 py-1.5">
            {formatRent(room.rent)}/mo
          </span>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <h1 className="font-display text-2xl md:text-4xl text-brand-dark dark:text-[#F9FAFB] mb-2">
          {room.title}
        </h1>
        <p className="flex items-center gap-2 text-brand-gray dark:text-gray-400 mb-4">
          <MapPin size={18} className="text-brand-green" />
          {room.area}, {cityName}, Himachal Pradesh
        </p>
        <p className="text-brand-black dark:text-gray-300 leading-relaxed mb-6">
          {room.description}
        </p>

        <div className="card-surface rounded-2xl p-4 mb-6">
          <h2 className="font-semibold mb-3 text-brand-dark dark:text-[#F9FAFB]">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {amenitiesList.length > 0 ? (
              amenitiesList.map((a) => (
                <span
                  key={a}
                  className="bg-brand-light dark:bg-[#1A2A1A] text-brand-green text-xs rounded-full px-3 py-1 capitalize"
                >
                  {a.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              ))
            ) : (
              <span className="text-brand-gray text-sm">Contact owner for details</span>
            )}
          </div>
        </div>

        <div className="hidden md:flex gap-3">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white rounded-xl py-3 font-semibold"
          >
            <MessageCircle size={20} /> WhatsApp Owner
          </a>
          <a
            href={phoneHref}
            className="flex-1 flex items-center justify-center gap-2 border-2 border-brand-green text-brand-green rounded-xl py-3 font-semibold"
          >
            <Phone size={20} /> Call
          </a>
        </div>
      </div>

      <div className="md:hidden fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] left-0 right-0 z-40 px-4 py-3 bg-white/95 dark:bg-[#111A11]/95 backdrop-blur border-t border-gray-200 dark:border-[#1F2E1F] flex gap-3">
        <motion.a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          whileTap={{ scale: 0.96 }}
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white rounded-xl py-3 font-semibold min-h-[44px]"
        >
          <MessageCircle size={20} /> WhatsApp
        </motion.a>
        <motion.a
          href={phoneHref}
          whileTap={{ scale: 0.96 }}
          className="flex-1 flex items-center justify-center gap-2 bg-brand-green text-white rounded-xl py-3 font-semibold min-h-[44px]"
        >
          <Phone size={20} /> Call
        </motion.a>
      </div>

      {fullscreen && room.images?.[0] && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[60] bg-black flex items-center justify-center"
        >
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            className="absolute top-20 right-4 text-white min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X size={28} />
          </button>
          <Image src={room.images[0]} alt={room.title} fill className="object-contain p-4" />
        </motion.div>
      )}
    </div>
  );
}
