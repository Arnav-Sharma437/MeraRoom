'use client';

import { motion } from 'framer-motion';
import SearchBar from '@/components/home/SearchBar';
import { HERO_STATS } from '@/constants';
import { fadeIn, fadeInUp } from '@/lib/animations';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-brand-dark to-brand-green/20" />

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            135deg,
            transparent,
            transparent 10px,
            white 10px,
            white 11px
          )`,
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />

      <div className="relative z-10 container mx-auto px-4 py-24 text-center">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 bg-brand-gold/20 text-brand-gold border border-brand-gold/30 rounded-full px-4 py-1.5 text-sm font-medium mb-8"
        >
          🏠 India&apos;s Trusted Room Finder
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="font-display text-5xl md:text-7xl leading-tight text-white mb-2"
        >
          Find Your Perfect
        </motion.h1>

        <motion.h1
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.35 }}
          className="font-display text-5xl md:text-7xl leading-tight mb-6"
        >
          <span className="text-brand-gold">Room</span>
          <span className="text-white"> in India</span>
        </motion.h1>

        <motion.p
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className="text-white/60 text-lg max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Search verified rooms, PGs &amp; hostels across India. Connect
          directly with owners on WhatsApp — instantly.
        </motion.p>

        <SearchBar />

        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-2 mt-8 text-white/50 text-sm"
        >
          {HERO_STATS.map((stat, i) => (
            <span key={stat} className="flex items-center gap-2">
              {i > 0 && <span className="hidden sm:inline">·</span>}
              {stat}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
