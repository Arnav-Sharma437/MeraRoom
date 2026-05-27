'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Home, CheckCircle, Gift, Zap } from 'lucide-react';
import { slideInLeft } from '@/lib/animations';

export default function AuthBrandPanel() {
  return (
    <motion.aside
      variants={slideInLeft}
      initial="hidden"
      animate="visible"
      className="hidden md:flex md:w-[40%] bg-[#0F2E1E] h-screen sticky top-0 flex-col justify-between p-10"
    >
      <div>
        <Image
          src="/meraroom-logo-dark.svg"
          alt="MeraRoom"
          width={160}
          height={48}
          className="h-10 w-auto"
          priority
        />
      </div>

      <div className="text-center">
        <Home className="w-24 h-24 mx-auto mb-6 text-[#D4AF37]/30" strokeWidth={1} />
        <h2 className="font-display text-3xl text-white leading-tight">
          Find Your Perfect
          <br />
          <span className="text-[#D4AF37]">Room in Dharamshala</span>
        </h2>
        <p className="text-white/50 mt-4 text-sm">
          Join thousands finding their ideal stay.
        </p>
      </div>

      <div className="flex justify-center gap-6 text-white/40 text-sm">
        <span className="flex items-center gap-1">
          <CheckCircle size={14} /> Verified
        </span>
        <span className="flex items-center gap-1">
          <Gift size={14} /> Free
        </span>
        <span className="flex items-center gap-1">
          <Zap size={14} /> Instant
        </span>
      </div>
    </motion.aside>
  );
}
