'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { slideInLeft } from '@/lib/animations';

export default function AuthBrandPanel() {
  return (
    <motion.aside
      variants={slideInLeft}
      initial="hidden"
      animate="visible"
      className="hidden lg:flex lg:w-[40%] bg-[#0F2E1E] h-screen sticky top-0 flex-col justify-between p-10"
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
        <p className="text-9xl mb-6 select-none" aria-hidden>
          🏠
        </p>
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
        <span>✓ Verified</span>
        <span>🆓 Free</span>
        <span>⚡ Instant</span>
      </div>
    </motion.aside>
  );
}
