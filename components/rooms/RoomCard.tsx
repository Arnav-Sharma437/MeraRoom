'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, MessageCircle, ArrowRight, Heart } from 'lucide-react';
import type { Room } from '@/types';
import type { IRoomAmenities } from '@/models/Room';
import { ROOM_TYPES, CITY } from '@/constants';
import { cn, formatRent, getWhatsAppLink } from '@/lib/utils';

interface RoomCardProps {
  room: Room;
  index?: number;
  view?: 'grid' | 'list';
  saved?: boolean;
  onToggleSave?: (id: string) => void;
}

function getAmenityChips(amenities: IRoomAmenities, furnishing: string, max = 3) {
  const chips: string[] = [];
  if (amenities.wifi) chips.push('WiFi');
  if (amenities.ac) chips.push('AC');
  if (furnishing === 'furnished') chips.push('Furnished');
  const total = Object.values(amenities).filter(Boolean).length;
  const shown = chips.length;
  if (total > shown) chips.push(`+${total - shown} more`);
  return chips.slice(0, max);
}

export default function RoomCard({
  room,
  index = 0,
  view = 'grid',
  saved = false,
  onToggleSave,
}: RoomCardProps) {
  const [isSaved, setIsSaved] = useState(saved);
  const roomTypeLabel = ROOM_TYPES.find((t) => t.value === room.roomType)?.label ?? room.roomType;
  const chips = getAmenityChips(room.amenities, room.furnishing, view === 'list' ? 4 : 3);
  const imageUrl = room.images?.[0];
  const whatsappHref = getWhatsAppLink(
    room.whatsappNumber,
    `Hi, I saw your room "${room.title}" on MeraRoom. Is it still available?`
  );

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
    onToggleSave?.(room._id);
  };

  const imageSection = (
    <div
      className={cn(
        'relative overflow-hidden bg-gradient-to-br from-[#0F2E1E] to-[#16A34A]',
        view === 'list' ? 'w-56 h-40 rounded-xl flex-shrink-0' : 'h-48 w-full',
        view === 'grid' && 'md:block hidden h-48'
      )}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={room.title}
          fill
          className="object-cover"
          sizes={view === 'list' ? '224px' : '(max-width:768px) 100vw, 33vw'}
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-5xl">🏠</span>
      )}
      <span className="absolute top-2 left-2 bg-[#0F2E1E]/80 backdrop-blur text-white text-xs rounded-full px-2.5 py-1">
        {roomTypeLabel}
      </span>
      {room.isFeatured && (
        <span className="absolute top-10 left-2 bg-[#D4AF37] text-[#0F2E1E] text-xs font-bold rounded-full px-2 py-0.5">
          ⭐ Featured
        </span>
      )}
      <motion.button
        type="button"
        whileTap={{ scale: 0.8 }}
        onClick={handleSave}
        className="absolute top-2 right-2 bg-white/20 backdrop-blur rounded-full p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center"
        aria-label="Save room"
      >
        <Heart size={18} className={cn(isSaved ? 'fill-red-500 text-red-500' : 'text-white')} />
      </motion.button>
      <span className="absolute bottom-2 right-2 bg-black/70 backdrop-blur text-white font-bold text-sm px-2.5 py-1 rounded-lg">
        {formatRent(room.rent)}/mo
      </span>
    </div>
  );

  const body = (
    <div className={cn('p-4 flex flex-col flex-1', view === 'list' && 'py-2')}>
      <h3 className="font-semibold text-base text-[#0F2E1E] dark:text-white line-clamp-1">{room.title}</h3>
      <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
        <MapPin size={13} className="text-[#16A34A] flex-shrink-0" />
        {room.area}, {CITY.name}
      </p>
      <div className="flex flex-wrap gap-1 mt-2">
        {chips.map((chip) => (
          <span
            key={chip}
            className="bg-[#F0FDF4] dark:bg-[#0F2E1E] text-[#16A34A] border border-[#D1FAE5] dark:border-[#16A34A]/30 text-xs rounded-full px-2 py-0.5"
          >
            {chip}
          </span>
        ))}
      </div>
      <div className="border-t border-gray-100 dark:border-[#1F2E1F] mt-3 pt-3 flex items-center justify-between gap-2 mt-auto">
        <div>
          <span className="text-xl font-bold text-[#0F2E1E] dark:text-white">{formatRent(room.rent)}</span>
          <span className="text-sm text-gray-400">/mo</span>
        </div>
        <div className="flex gap-2">
          <motion.a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#25D366] text-white rounded-xl p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center whatsapp-pulse"
          >
            <MessageCircle size={18} />
          </motion.a>
          <Link
            href={`/rooms/${room._id}`}
            className="bg-[#16A34A] text-white rounded-xl px-3 py-2 text-sm font-medium flex items-center gap-1 hover:bg-[#D4AF37] hover:text-[#0F2E1E] transition-colors duration-200 min-h-[44px]"
          >
            View <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );

  if (view === 'list') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.06, duration: 0.4 }}
        className="hidden md:flex gap-4 bg-white dark:bg-[#111A11] rounded-2xl overflow-hidden border border-gray-100 dark:border-[#1F2E1F] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        {imageSection}
        {body}
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-[#111A11] rounded-2xl overflow-hidden border border-gray-100 dark:border-[#1F2E1F] shadow-sm md:hover:shadow-xl md:hover:-translate-y-[5px] transition-all duration-300"
    >
      <div className="md:hidden flex gap-3 p-3">
        <div className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-[#0F2E1E] to-[#16A34A]">
          {imageUrl ? (
            <Image src={imageUrl} alt={room.title} fill className="object-cover" sizes="128px" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-3xl">🏠</span>
          )}
          <span className="absolute top-1 left-1 bg-[#0F2E1E]/80 text-white text-[10px] rounded px-1.5">{roomTypeLabel}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base text-[#0F2E1E] dark:text-white line-clamp-2">{room.title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-0.5 mt-0.5">
            <MapPin size={12} className="text-[#16A34A]" /> {room.area}
          </p>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {chips.slice(0, 2).map((c) => (
              <span key={c} className="text-[10px] bg-[#F0FDF4] dark:bg-[#0F2E1E] text-[#16A34A] rounded-full px-1.5 py-0.5">
                {c}
              </span>
            ))}
          </div>
          <p className="font-bold text-[#16A34A] text-sm mt-1">{formatRent(room.rent)}/mo</p>
        </div>
      </div>
      <div className="md:hidden flex gap-2 px-3 pb-3">
        <motion.a href={whatsappHref} target="_blank" rel="noopener noreferrer" whileTap={{ scale: 0.96 }} className="flex-1 flex items-center justify-center gap-1 bg-[#25D366] text-white rounded-xl py-2.5 text-sm font-medium min-h-[44px] whatsapp-pulse">
          <MessageCircle size={16} /> WhatsApp
        </motion.a>
        <Link href={`/rooms/${room._id}`} className="flex-1 flex items-center justify-center bg-[#16A34A] text-white rounded-xl py-2.5 text-sm font-medium min-h-[44px]">
          View
        </Link>
      </div>
      <div className="hidden md:block">
        {imageSection}
        {body}
      </div>
    </motion.article>
  );
}
