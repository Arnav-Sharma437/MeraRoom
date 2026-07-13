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
        'rounded-full p-2 min-w-[44px] min-h-[44px] flex items-center justify-center shadow-md',
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
    <div className="w-full space-y-4">
      {/* Main Image View */}
      <div
        className="relative w-full h-[320px] md:h-[480px] rounded-2xl overflow-hidden bg-gray-100 dark:bg-[#111A11] group cursor-pointer shadow-sm"
        onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const diff = touchStart - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 50) go(diff > 0 ? 1 : -1);
        }}
        onClick={() => gallery.length && setLightbox(true)}
      >
        {gallery.length ? (
          <Image
            src={gallery[index]}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.01]"
            priority
          />
        ) : (
          fallback
        )}

        {/* Floating Top Nav */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10" onClick={(e) => e.stopPropagation()}>
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => router.back()}
            className="bg-black/30 backdrop-blur rounded-full p-2 text-white min-w-[44px] min-h-[44px] flex items-center justify-center shadow-sm"
          >
            <ArrowLeft size={22} />
          </motion.button>
          <div className="flex gap-2">
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => navigator.share?.({ title, url: window.location.href })}
              className="bg-black/30 backdrop-blur rounded-full p-2 text-white min-w-[44px] min-h-[44px] flex items-center justify-center shadow-sm"
            >
              <Share2 size={20} />
            </motion.button>
            {heartBtn}
          </div>
        </div>

        {/* Hover Arrow Controls (Desktop) / Slide Controls (Mobile) */}
        {gallery.length > 1 && (
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-10">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); go(-1); }}
              className="bg-white/90 dark:bg-black/50 text-gray-800 dark:text-white backdrop-blur rounded-full p-2.5 shadow-md pointer-events-auto hover:bg-white dark:hover:bg-black transition-all md:opacity-0 group-hover:opacity-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); go(1); }}
              className="bg-white/90 dark:bg-black/50 text-gray-800 dark:text-white backdrop-blur rounded-full p-2.5 shadow-md pointer-events-auto hover:bg-white dark:hover:bg-black transition-all md:opacity-0 group-hover:opacity-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        )}

        {/* Counter Badge */}
        {gallery.length > 1 && (
          <span className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-medium rounded-full px-3 py-1 z-10">
            {index + 1} / {gallery.length}
          </span>
        )}
      </div>

      {/* Thumbnails Row */}
      {gallery.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200 hide-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
          {gallery.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "relative w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-200 shadow-sm",
                i === index
                  ? "border-[#16A34A] scale-95"
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox */}
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
    </div>
  );
}
