'use client';

import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import SearchBar from '@/components/home/SearchBar';
import { fadeInUp } from '@/lib/animations';

export default function HeroSection() {
  return (
    <section className="relative bg-brand-dark dark:bg-brand-dark-deep overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(212, 175, 55, 0.5) 10px, rgba(212, 175, 55, 0.5) 20px)`,
        }}
      />
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto text-center"
        >
          <span className="inline-flex items-center gap-2 bg-brand-gold/20 text-brand-gold border border-brand-gold/30 rounded-full px-4 py-1.5 text-sm mb-6">
            <Home size={16} />
            Dharamshala&apos;s Trusted Room Finder
          </span>
          <h1 className="font-display text-4xl md:text-6xl text-white leading-tight mb-4">
            Find Your Perfect
            <br />
            <span className="text-brand-gold">Room in Dharamshala</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl mb-8 max-w-xl mx-auto">
            Verified PGs, single rooms & shared stays across 17 localities. Connect directly with
            owners on WhatsApp.
          </p>
          <SearchBar />
        </motion.div>
      </div>
    </section>
  );
}
