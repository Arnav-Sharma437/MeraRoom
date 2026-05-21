'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeInUp, viewportOnce } from '@/lib/animations';

export default function CTABanner() {
  return (
    <section className="bg-gradient-to-br from-brand-dark to-brand-green py-20">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="container mx-auto px-4 text-center"
      >
        <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
          Ready to Find Your Room?
        </h2>
        <p className="text-white/60 text-lg max-w-xl mx-auto mb-10">
          Join thousands of students and professionals who found their perfect
          room on MeraRoom.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/search"
            className="bg-brand-gold text-brand-dark font-bold rounded-xl px-8 py-4 transition-default hover:brightness-110 hover:scale-[1.03] active:scale-[0.97] w-full sm:w-auto text-center"
          >
            Search Rooms Now
          </Link>
          <Link
            href="/dashboard/owner"
            className="border-2 border-white text-white rounded-xl px-8 py-4 font-semibold transition-default hover:bg-white hover:text-brand-dark w-full sm:w-auto text-center"
          >
            List Your Room Free
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
