'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface Ad {
  slot: number;
  businessName: string;
  phone: string;
  bannerImage: string;
  linkUrl?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isPaid: boolean;
}

interface AdBannerProps {
  slot: 1 | 2 | 3;
  className?: string;
}

export default function AdBanner({ slot, className }: AdBannerProps) {
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadAd() {
      try {
        const res = await fetch(`/api/ads?slot=${slot}`, { cache: 'no-store' });
        const json = await res.json();
        if (active && json.success) {
          setAd(json.data);
        }
      } catch (err) {
        console.error('Failed to load ad banner for slot', slot, err);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadAd();
    return () => {
      active = false;
    };
  }, [slot]);

  if (loading || !ad) {
    return null;
  }

  // Sizing definitions based on slot
  let sizeClasses = '';
  if (slot === 1) {
    sizeClasses = 'h-32 md:h-40 mx-4 md:mx-0';
  } else if (slot === 2) {
    sizeClasses = 'h-28 md:h-36';
  } else if (slot === 3) {
    sizeClasses = 'h-32 md:h-40';
  }

  const bannerContent = (
    <div className="relative w-full h-full bg-gray-50 dark:bg-[#0A0F0A] overflow-hidden group">
      <Image
        src={ad.bannerImage}
        alt={ad.businessName}
        fill
        className="transition-transform duration-500 group-hover:scale-[1.02] object-cover"
        unoptimized
      />
      {/* Sponsored label */}
      <span className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm select-none z-10">
        Sponsored
      </span>

      {/* Business Name overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3 pt-6 flex items-end">
        <span className="text-white text-[10px] sm:text-xs font-semibold select-none bg-black/50 px-2 py-0.5 sm:py-1 rounded">
          {ad.businessName}
        </span>
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-gray-150 dark:border-white/5 select-none shadow-sm transition-all duration-300",
        ad.linkUrl && "hover:opacity-95 cursor-pointer",
        sizeClasses,
        className
      )}
    >
      {ad.linkUrl ? (
        <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
          {bannerContent}
        </a>
      ) : (
        bannerContent
      )}
    </div>
  );
}
