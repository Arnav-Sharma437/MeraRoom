'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

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

  const imageFit = slot === 2 ? 'object-cover' : 'object-cover';

  const bannerContent = (
    <div className="relative w-full h-full bg-gray-50 dark:bg-[#0A0F0A] overflow-hidden group">
      <Image
        src={ad.bannerImage}
        alt={ad.businessName}
        fill
        className={`transition-transform duration-500 group-hover:scale-102 ${imageFit}`}
        unoptimized
      />
      {/* Ad tag badge */}
      <span className="absolute top-0 right-0 bg-black/60 text-white/95 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-bl-lg uppercase select-none z-10">
        Ad
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
    <div className={`rounded-2xl overflow-hidden border border-gray-150 dark:border-white/5 transition-all select-none shadow-sm relative ${className || ''}`}>
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
