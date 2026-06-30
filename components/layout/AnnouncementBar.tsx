'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, X, ArrowRight } from 'lucide-react';
import type { UserRole } from '@/models/User';

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(false);
  const { data: session } = useSession();
  const role = (session?.user as { role?: UserRole })?.role;
  const isLoggedIn = !!session?.user;

  // Determine CTA link
  const postRoomHref = isLoggedIn && role === 'owner' ? '/dashboard/owner/post' : '/register?role=owner';

  useEffect(() => {
    // Check if user has previously dismissed the announcement bar
    const isDismissed = localStorage.getItem('meraroom_announcement_dismissed');
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('meraroom_announcement_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="relative w-full overflow-hidden bg-gradient-to-r from-[#D4AF37] via-[#F3C63F] to-[#D4AF37] text-[#0F2E1E] shadow-sm z-[60]"
        >
          {/* Shimmer background animation */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-announcement-shimmer" />

          <div className="container mx-auto px-4 py-2.5 flex items-center justify-between gap-4 relative z-10">
            <div className="flex-1 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium font-sans text-center">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, repeatDelay: 1 }}
                className="flex-shrink-0"
              >
                <Megaphone size={16} className="text-[#0F2E1E]" />
              </motion.div>
              <span>
                <strong className="font-bold">Special Launch Offer:</strong> First 10 room listings are{' '}
                <span className="bg-[#0F2E1E] text-white px-1.5 py-0.5 rounded font-bold text-[11px] sm:text-xs tracking-wider inline-block transform -rotate-1 shadow-sm">
                  100% FREE
                </span>{' '}
                — list your property now!
              </span>
              <Link
                href={postRoomHref}
                className="inline-flex items-center gap-1 ml-2 font-bold underline hover:text-[#0F2E1E]/80 transition-colors group text-xs sm:text-sm"
              >
                List Free
                <ArrowRight size={14} className="transform transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 rounded-full text-[#0F2E1E]/70 hover:text-[#0F2E1E] hover:bg-black/5 transition-all duration-200"
              aria-label="Dismiss announcement"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
