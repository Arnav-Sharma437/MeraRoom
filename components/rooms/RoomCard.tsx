'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, MessageCircle } from 'lucide-react';
import type { Room } from '@/types';
import type { IRoomAmenities } from '@/models/Room';
import { ROOM_TYPES } from '@/constants';
import { cn, formatRent, getWhatsAppLink } from '@/lib/utils';
import { fadeInUp } from '@/lib/animations';

interface RoomCardProps {
  room: Room | FeaturedRoomData;
  index?: number;
}

interface FeaturedRoomData {
  _id: string;
  title: string;
  rent: number;
  area: string;
  city: { name: string; slug: string } | string;
  roomType: string;
  furnishing: string;
  images: string[];
  isFeatured?: boolean;
  whatsappNumber: string;
  amenities: IRoomAmenities;
}

function getCityName(city: FeaturedRoomData['city']): string {
  if (typeof city === 'string') return city;
  return city?.name ?? 'Dharamshala';
}

function getAmenityChips(amenities: IRoomAmenities, furnishing: string) {
  const chips: string[] = [];
  if (amenities.wifi) chips.push('WiFi');
  if (amenities.ac) chips.push('AC');
  if (furnishing === 'furnished') chips.push('Furnished');
  const extra = Object.values(amenities).filter(Boolean).length - chips.length;
  if (extra > 0) chips.push(`+${extra} more`);
  return chips.slice(0, 4);
}

export default function RoomCard({ room, index = 0 }: RoomCardProps) {
  const cityName = getCityName(room.city as FeaturedRoomData['city']);
  const roomTypeLabel =
    ROOM_TYPES.find((t) => t.value === room.roomType)?.label ?? room.roomType;
  const chips = getAmenityChips(room.amenities, room.furnishing);
  const imageUrl = room.images?.[0];
  const whatsappHref = getWhatsAppLink(
    room.whatsappNumber,
    `Hi, I'm interested in "${room.title}" on MeraRoom (Dharamshala).`
  );

  return (
    <motion.article
      variants={fadeInUp}
      transition={{ delay: index * 0.05 }}
      whileTap={{ scale: 0.98 }}
      className="card-surface rounded-2xl overflow-hidden shadow-md dark:shadow-card-dark transition-default md:hover:shadow-xl md:hover:-translate-y-1.5 touch-pan-y"
    >
      {/* Mobile: horizontal */}
      <div className="flex md:hidden gap-3 p-3">
        <div className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden">
          {imageUrl ? (
            <Image src={imageUrl} alt={room.title} fill className="object-cover" sizes="128px" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-dark to-brand-green flex items-center justify-center text-3xl">
              🏔️
            </div>
          )}
          <span className="absolute top-1 left-1 bg-brand-dark text-white text-[10px] rounded px-1.5">
            {roomTypeLabel}
          </span>
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <h3 className="font-semibold text-base text-brand-dark dark:text-[#F9FAFB] line-clamp-2">
              {room.title}
            </h3>
            <p className="text-xs text-brand-gray dark:text-gray-400 mt-1 flex items-center gap-0.5">
              <MapPin size={12} className="text-brand-green" />
              {room.area}
            </p>
            <p className="font-bold text-brand-green text-sm mt-1">{formatRent(room.rent)}/mo</p>
          </div>
        </div>
      </div>
      <div className="md:hidden flex gap-2 px-3 pb-3">
        <motion.a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          whileTap={{ scale: 0.96 }}
          className="flex-1 flex items-center justify-center gap-1 bg-[#25D366] text-white rounded-lg py-2.5 text-sm font-medium min-h-[44px] whatsapp-pulse"
        >
          <MessageCircle size={16} /> Chat
        </motion.a>
        <Link
          href={`/rooms/${room._id}`}
          className="flex-1 flex items-center justify-center bg-brand-green text-white rounded-lg py-2.5 text-sm font-medium min-h-[44px]"
        >
          Details
        </Link>
      </div>

      {/* Desktop: vertical */}
      <div className="hidden md:block">
        <div className="relative h-52 img-hover-zoom">
          {imageUrl ? (
            <Image src={imageUrl} alt={room.title} fill className="object-cover" sizes="33vw" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-dark to-brand-green flex items-center justify-center text-5xl">
              🏔️
            </div>
          )}
          <span className="absolute top-3 left-3 bg-brand-dark text-white text-xs font-medium rounded-full px-2.5 py-1">
            {roomTypeLabel}
          </span>
          {room.isFeatured && (
            <span className="absolute top-3 right-3 bg-brand-gold text-brand-dark text-xs font-bold rounded-full px-2.5 py-1">
              Featured
            </span>
          )}
          <span className="absolute bottom-3 right-3 bg-black/60 text-white font-bold text-sm rounded-lg px-2.5 py-1">
            {formatRent(room.rent)}/mo
          </span>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-brand-dark dark:text-[#F9FAFB] line-clamp-1 mb-1">
            {room.title}
          </h3>
          <p className="flex items-center gap-1 text-brand-gray dark:text-gray-400 text-sm mb-3">
            <MapPin size={14} className="text-brand-green" />
            {room.area}, {cityName}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {chips.map((chip) => (
              <span
                key={chip}
                className="bg-brand-light dark:bg-[#1A2A1A] text-brand-green text-xs rounded-full px-2 py-0.5 border border-brand-border dark:border-[#1F2E1F]"
              >
                {chip}
              </span>
            ))}
          </div>
          <div className="border-t border-gray-100 dark:border-[#1F2E1F] pt-3 flex items-center justify-between">
            <div>
              <span className="font-bold text-brand-dark dark:text-[#F9FAFB] text-lg">
                {formatRent(room.rent)}
              </span>
              <span className="text-brand-gray text-sm">/mo</span>
            </div>
            <div className="flex gap-2">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn('bg-[#25D366] text-white rounded-lg p-2 whatsapp-pulse min-h-[44px] min-w-[44px] flex items-center justify-center')}
              >
                <MessageCircle size={18} />
              </a>
              <Link
                href={`/rooms/${room._id}`}
                className="bg-brand-green text-white rounded-lg px-3 py-2 text-sm font-medium hover:bg-brand-gold hover:text-brand-dark transition-default"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
