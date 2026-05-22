'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { ABOUT_STATS, ABOUT_VALUES, TEAM } from '@/constants';
import { fadeInUp, staggerContainer, viewportOnce } from '@/lib/animations';

const diagonalPattern = {
  backgroundImage: `repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(212, 175, 55, 0.03) 10px,
    rgba(212, 175, 55, 0.03) 20px
  )`,
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        className="relative bg-[#0F2E1E] py-20 px-6 text-center"
        style={diagonalPattern}
      >
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-block bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 rounded-full px-4 py-1.5 text-sm mb-6"
          >
            🏔️ Based in Dharamshala, HP
          </motion.span>
          <motion.h1 variants={fadeInUp} className="font-display text-4xl sm:text-5xl text-white leading-tight">
            We&apos;re Making Room
            <br />
            <span className="text-[#D4AF37]">Finding Simple</span>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-white/60 max-w-xl mx-auto text-center text-lg mt-6"
          >
            MeraRoom was built for the people of Dharamshala — students, workers, and
            travelers who needed a faster, simpler way to find a place to stay.
          </motion.p>
        </motion.div>
      </section>

      {/* Our Story */}
      <section className="bg-white dark:bg-[#0A0F0A] py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeInUp}>
              <p className="text-[#16A34A] uppercase tracking-widest text-sm font-semibold mb-3">
                Our Story
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-[#0F2E1E] dark:text-white mb-6">
                Born in Dharamshala
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  Finding a room in Dharamshala was always a hassle — WhatsApp groups,
                  word of mouth, random brokers. We wanted to change that.
                </p>
                <p>
                  MeraRoom is a simple, fast platform where anyone can find verified
                  rooms, PGs and stays across Dharamshala and nearby areas — and connect
                  directly with owners on WhatsApp.
                </p>
                <p>
                  No middlemen. No complicated forms. Just find your room, tap WhatsApp,
                  and move in.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-[#0F2E1E] rounded-3xl p-8"
            >
              <div className="grid grid-cols-2 gap-8">
                {ABOUT_STATS.map((stat) => (
                  <div key={stat.label} className="text-center sm:text-left">
                    <p className="font-display text-4xl text-[#D4AF37]">{stat.value}</p>
                    <p className="text-white/60 text-sm mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-[#F9F6EF] dark:bg-[#0D150D] py-20 px-6">
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="container mx-auto max-w-4xl"
        >
          <motion.h2
            variants={fadeInUp}
            className="font-display text-3xl sm:text-4xl text-center text-[#0F2E1E] dark:text-white mb-12"
          >
            The Team Behind MeraRoom
          </motion.h2>

          <div className="flex flex-col md:flex-row gap-6 max-w-2xl mx-auto">
            {TEAM.map((member) => (
              <motion.div
                key={member.name}
                variants={fadeInUp}
                whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
                className="flex-1 bg-white dark:bg-[#111A11] rounded-3xl p-8 border border-gray-100 dark:border-[#1F2E1F] shadow-md text-center transition-shadow duration-300"
              >
                <div className="w-20 h-20 mx-auto bg-[#0F2E1E] rounded-full flex items-center justify-center">
                  <span className="font-display text-3xl text-[#D4AF37]">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-semibold text-xl text-[#0F2E1E] dark:text-white mt-4">
                  {member.name}
                </h3>
                <p className="text-[#16A34A] text-sm font-medium mt-1">{member.role}</p>
                <p className="text-gray-500 text-sm mt-1 flex items-center justify-center gap-1.5">
                  <Phone size={14} />
                  {member.phone}
                </p>
                <motion.a
                  href={member.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center justify-center w-full mt-4 bg-[#25D366] text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:brightness-110 transition-default"
                >
                  💬 Chat on WhatsApp
                </motion.a>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Values */}
      <section className="bg-white dark:bg-[#0A0F0A] py-20 px-6">
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="container mx-auto max-w-6xl"
        >
          <motion.h2
            variants={fadeInUp}
            className="font-display text-3xl sm:text-4xl text-center text-[#0F2E1E] dark:text-white mb-12"
          >
            What We Stand For
          </motion.h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {ABOUT_VALUES.map((value) => (
              <motion.div
                key={value.title}
                variants={fadeInUp}
                whileHover={{ borderColor: '#16A34A' }}
                className="bg-[#F9F6EF] dark:bg-[#111A11] rounded-2xl p-6 border-b-4 border-[#D4AF37] hover:shadow-lg transition-all duration-300"
              >
                <span className="text-3xl" aria-hidden>
                  {value.icon}
                </span>
                <h3 className="font-semibold text-[#0F2E1E] dark:text-white mt-3 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="bg-[#0F2E1E] py-16 px-6 text-center">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <h2 className="font-display text-3xl sm:text-4xl text-white mb-3">
            Ready to Find Your Room?
          </h2>
          <p className="text-white/60 mb-8">
            Search verified rooms in Dharamshala right now.
          </p>
          <motion.div whileTap={{ scale: 0.96 }}>
            <Link
              href="/search"
              className="inline-block bg-[#D4AF37] text-[#0F2E1E] font-semibold rounded-xl px-8 py-3.5 hover:brightness-110 transition-default"
            >
              Search Rooms →
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
