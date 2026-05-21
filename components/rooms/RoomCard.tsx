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
  return city?.name ?? '';
}

function getAmenityChips(amenities: IRoomAmenities, furnishing: string) {
  const chips: string[] = [];
  if (amenities.wifi) chips.push('WiFi');
  if (amenities.ac) chips.push('AC');
  if (furnishing === 'furnished') chips.push('Furnished');
  const totalActive = Object.values(amenities).filter(Boolean).length;
  const extra = totalActive - chips.length;
  if (extra > 0) chips.push(`+${extra} more`);
  return chips.slice(0, 4);
}

export default function RoomCard({ room, index = 0 }: RoomCardProps) {
  const cityName = getCityName(room.city as FeaturedRoomData['city']);
  const roomTypeLabel =
    ROOM_TYPES.find((t) => t.value === room.roomType)?.label ?? room.roomType;
  const chips = getAmenityChips(room.amenities, room.furnishing);
  const imageUrl = room.images?.[0];
  const whatsappMsg = `Hi, I'm interested in "${room.title}" listed on MeraRoom.`;
  const whatsappHref = getWhatsAppLink(room.whatsappNumber, whatsappMsg);

  return (
    <motion.article
      variants={fadeInUp}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md transition-default hover:shadow-xl hover:-translate-y-1.5"
    >
      <div className="relative h-52 img-hover-zoom">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={room.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-dark to-brand-green flex items-center justify-center text-5xl">
            🏠
          </div>
        )}

        <span className="absolute top-3 left-3 bg-brand-dark text-white text-xs font-medium rounded-full px-2.5 py-1">
          {roomTypeLabel}
        </span>

        {room.isFeatured && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="absolute top-3 right-3 bg-brand-gold text-brand-dark text-xs font-bold rounded-full px-2.5 py-1"
          >
            Featured
          </motion.span>
        )}

        <span className="absolute bottom-3 right-3 bg-black/60 text-white font-bold text-sm rounded-lg px-2.5 py-1">
          {formatRent(room.rent)}/mo
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-brand-dark line-clamp-1 mb-1">
          {room.title}
        </h3>
        <p className="flex items-center gap-1 text-brand-gray text-sm mb-3">
          <MapPin size={14} className="text-brand-green flex-shrink-0" />
          {room.area}, {cityName}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {chips.map((chip) => (
            <span
              key={chip}
              className="bg-brand-light text-brand-green text-xs rounded-full px-2 py-0.5 border border-brand-border"
            >
              {chip}
            </span>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-3 flex items-center justify-between gap-2">
          <div>
            <span className="font-bold text-brand-dark text-lg">
              {formatRent(room.rent)}
            </span>
            <span className="text-brand-gray text-sm">/mo</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'bg-[#25D366] text-white rounded-lg p-2 transition-default hover:brightness-110',
                'whatsapp-pulse'
              )}
              aria-label="Contact on WhatsApp"
            >
              <MessageCircle size={18} />
            </a>
            <Link
              href={`/rooms/${room._id}`}
              className="bg-brand-green text-white rounded-lg px-3 py-2 text-sm font-medium transition-default hover:bg-brand-gold hover:text-brand-dark active:scale-[0.97]"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
