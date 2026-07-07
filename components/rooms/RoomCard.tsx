'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, MessageCircle, ArrowRight, Heart, Home, Star } from 'lucide-react';
import type { Room } from '@/types';
import type { IRoomAmenities } from '@/models/Room';
import { ROOM_TYPES, CITY } from '@/constants';
import { cn, formatRent, getWhatsAppLink } from '@/lib/utils';
import { useSavedRooms } from '@/hooks/useSavedRooms';

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
  saved: savedProp,
  onToggleSave,
}: RoomCardProps) {
  const { isSaved: checkSaved, toggleSave, loaded } = useSavedRooms();
  const [isSaved, setIsSaved] = useState(savedProp ?? false);

  useEffect(() => {
    if (savedProp !== undefined) {
      setIsSaved(savedProp);
    } else if (loaded) {
      setIsSaved(checkSaved(room._id));
    }
  }, [savedProp, loaded, checkSaved, room._id]);

  const roomTypeLabel = ROOM_TYPES.find((t) => t.value === room.roomType)?.label ?? room.roomType;
  const chips = getAmenityChips(room.amenities, room.furnishing, view === 'list' ? 4 : 3);
  const imageUrl = room.images?.[0];
  // Alternate between Arnav's and Varun's contact numbers based on room ID
  const isEven = parseInt(room._id.toString().slice(-1), 16) % 2 === 0;
  const adminPhone = isEven ? '+91 7876650437' : '+91 9418100803';

  const whatsappHref = getWhatsAppLink(
    adminPhone,
    `Hi, I saw your room "${room.title}" on MeraRoom. Is it still available?`
  );

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleSave(room._id);
    onToggleSave?.(room._id);
  };

  const heartButton = (
    <motion.button
      type="button"
      whileTap={{ scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onClick={handleSave}
      className={cn(
        'absolute top-2 right-2 rounded-full p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center transition-colors',
        isSaved
          ? 'bg-red-500 text-white'
          : 'bg-white/80 backdrop-blur text-gray-600 dark:bg-[#111A11]/80 dark:text-gray-300'
      )}
      aria-label={isSaved ? 'Remove from saved' : 'Save room'}
    >
      <Heart size={18} className={cn(isSaved && 'fill-current')} />
    </motion.button>
  );

  const imageSection = (
    <div
      className={cn(
        'relative overflow-hidden bg-gradient-to-br from-[#0F2E1E] to-[#16A34A]',
        view === 'list' ? 'w-56 h-40 rounded-xl flex-shrink-0' : 'h-48 w-full'
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
        <span className="absolute inset-0 flex items-center justify-center text-[#D4AF37]/40">
          <Home size={48} />
        </span>
      )}
      <span className="absolute top-2 left-2 bg-[#0F2E1E]/80 backdrop-blur text-white text-xs rounded-full px-2.5 py-1">
        {roomTypeLabel}
      </span>
      {room.isAvailable === false && (
        <span className="absolute top-10 left-2 bg-red-600 text-white text-xs font-bold rounded-full px-2.5 py-0.5 z-10">
          Sold Out
        </span>
      )}
      {room.isFeatured && (
        <span
          className={cn(
            'absolute left-2 bg-[#D4AF37] text-[#0F2E1E] text-xs font-bold rounded-full px-2 py-0.5 flex items-center gap-1 z-10',
            room.isAvailable === false ? 'top-[68px]' : 'top-10'
          )}
        >
          <Star size={12} fill="currentColor" />
          Featured
        </span>
      )}
      {heartButton}
      <span className="absolute bottom-2 right-2 bg-black/70 backdrop-blur text-white font-bold text-sm px-2.5 py-1 rounded-lg">
        {formatRent(room.rent)}/mo
      </span>
    </div>
  );

  const body = (
    <div className={cn('p-4 flex flex-col flex-1', view === 'list' && 'py-2')}>
      <h3 className="font-semibold text-base text-[#0F2E1E] dark:text-white line-clamp-2">{room.title}</h3>
      <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
        <MapPin size={13} className="text-[#16A34A] flex-shrink-0" />
        <span className="truncate">{room.area}, {CITY.name}</span>
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
      className="bg-white dark:bg-[#111A11] rounded-2xl overflow-hidden border border-gray-100 dark:border-[#1F2E1F] shadow-sm md:hover:shadow-xl md:hover:-translate-y-[5px] transition-all duration-300 w-full"
    >
      {imageSection}
      {body}
    </motion.article>
  );
}
