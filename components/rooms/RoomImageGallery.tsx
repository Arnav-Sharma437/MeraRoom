'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ArrowLeft, Share2, Heart, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface RoomImageGalleryProps {
  images: string[];
  title: string;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

export default function RoomImageGallery({
  images,
  title,
  isSaved = false,
  onToggleSave,
}: RoomImageGalleryProps) {
  const router = useRouter();
  const gallery = images.length > 0 ? images : [];
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [saved, setSaved] = useState(isSaved);
  const [touchStart, setTouchStart] = useState(0);

  useEffect(() => {
    setSaved(isSaved);
  }, [isSaved]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false);
      if (lightbox && e.key === 'ArrowRight') setIndex((i) => (i + 1) % Math.max(gallery.length, 1));
      if (lightbox && e.key === 'ArrowLeft') setIndex((i) => (i - 1 + Math.max(gallery.length, 1)) % Math.max(gallery.length, 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, gallery.length]);

  const go = (dir: number) => {
    if (!gallery.length) return;
    setIndex((i) => (i + dir + gallery.length) % gallery.length);
  };

  const handleSaveClick = () => {
    onToggleSave?.();
  };

  const fallback = (
    <div className="absolute inset-0 bg-gradient-to-br from-[#0F2E1E] to-[#16A34A] flex items-center justify-center text-[#D4AF37]/30">
      <Home size={64} />
    </div>
  );

  const heartBtn = (
    <motion.button
      type="button"
      whileTap={{ scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onClick={handleSaveClick}
      className={cn(
        'rounded-full p-2 min-w-[44px] min-h-[44px] flex items-center justify-center',
        saved
          ? 'bg-red-500 text-white'
          : 'bg-white/80 backdrop-blur text-gray-600'
      )}
      aria-label="Save room"
    >
      <Heart size={20} className={cn(saved && 'fill-current')} />
    </motion.button>
  );

  return (
    <>
      <div
        className="lg:hidden relative h-72 md:h-80 w-full overflow-hidden"
        onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const diff = touchStart - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 50) go(diff > 0 ? 1 : -1);
        }}
      >
        {gallery.length ? (
          <Image src={gallery[index]} alt={title} fill className="object-cover" priority />
        ) : (
          fallback
        )}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10">
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => router.back()}
            className="bg-black/30 backdrop-blur rounded-full p-2 text-white min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <ArrowLeft size={22} />
          </motion.button>
          <div className="flex gap-2">
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => navigator.share?.({ title, url: window.location.href })}
              className="bg-black/30 backdrop-blur rounded-full p-2 text-white min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <Share2 size={20} />
            </motion.button>
            {heartBtn}
          </div>
        </div>
        {gallery.length > 1 && (
          <>
            <span className="absolute top-14 right-4 bg-black/50 text-white text-xs rounded-full px-2 py-1 z-10">
              {index + 1} / {gallery.length}
            </span>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
              {gallery.map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
          </>
        )}
        <button type="button" className="absolute inset-0 z-0" onClick={() => gallery.length && setLightbox(true)} aria-label="View fullscreen" />
      </div>

      <div className="hidden lg:grid grid-cols-4 grid-rows-2 gap-2 h-96 rounded-2xl overflow-hidden">
        <button
          type="button"
          className="col-span-2 row-span-2 relative rounded-l-2xl overflow-hidden"
          onClick={() => gallery.length && setLightbox(true)}
        >
          {gallery[0] ? <Image src={gallery[0]} alt={title} fill className="object-cover" priority /> : fallback}
        </button>
        {[1, 2, 3].map((i) => (
          <button
            key={i}
            type="button"
            className="relative overflow-hidden"
            onClick={() => { setIndex(i); setLightbox(true); }}
          >
            {gallery[i] ? (
              <Image src={gallery[i]} alt={`${title} ${i + 1}`} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#0F2E1E] to-[#16A34A]" />
            )}
            {i === 3 && gallery.length > 4 && (
              <span className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold">
                +{gallery.length - 4} more photos
              </span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {lightbox && gallery.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black flex items-center justify-center"
          >
            <button type="button" onClick={() => setLightbox(false)} className="absolute top-4 right-4 text-white z-10 min-w-[44px] min-h-[44px] flex items-center justify-center">
              <X size={28} />
            </button>
            {gallery.length > 1 && (
              <>
                <button type="button" onClick={() => go(-1)} className="absolute left-4 text-white p-3 min-w-[44px] min-h-[44px] flex items-center justify-center">
                  <ChevronLeft size={32} />
                </button>
                <button type="button" onClick={() => go(1)} className="absolute right-4 text-white p-3 min-w-[44px] min-h-[44px] flex items-center justify-center">
                  <ChevronRight size={32} />
                </button>
              </>
            )}
            <Image src={gallery[index]} alt={title} fill className="object-contain p-8" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
