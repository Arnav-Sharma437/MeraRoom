'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeInUp, viewportOnce } from '@/lib/animations';

export default function CTABanner() {
  return (
    <section className="bg-gradient-to-br from-brand-dark to-brand-green dark:from-brand-dark-deep dark:to-brand-green/80 py-16 md:py-20">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="container mx-auto px-4 text-center"
      >
        <h2 className="font-display text-3xl md:text-5xl text-white mb-4">
          Ready to Find Your Room in Dharamshala?
        </h2>
        <p className="text-white/60 text-base md:text-lg max-w-xl mx-auto mb-10">
          Join students, travellers, and locals who found their perfect space in
          McLeod Ganj, Bhagsu, Dharamkot &amp; beyond.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.div whileTap={{ scale: 0.97 }}>
            <Link
              href="/search"
              className="inline-block bg-brand-gold text-brand-dark font-bold rounded-xl px-8 py-4 min-h-[44px] transition-default hover:brightness-110 hover:scale-[1.03] w-full sm:w-auto"
            >
              Search Rooms Now
            </Link>
          </motion.div>
          <motion.div whileTap={{ scale: 0.97 }}>
            <Link
              href="/dashboard/owner"
              className="inline-block border-2 border-white text-white rounded-xl px-8 py-4 font-semibold min-h-[44px] transition-default hover:bg-white hover:text-brand-dark w-full sm:w-auto"
            >
              List Your Room Free
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
